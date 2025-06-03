'use client';

import { useEffect, useState } from 'react';

import { Check, Copy, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CodeEditor } from '@/components/ui/code-editor';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import AutomatonManager from '@/lib/automata/AutomatonManager';

export function ExportCode({ title }: { title?: string | null }) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [exportJson, setExportJson] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isExportDialogOpen) return;
    const json = JSON.stringify(AutomatonManager.getDesigner().toJson(), null, 2);
    setExportJson(json);
  }, [isExportDialogOpen]);

  const downloadJson = () => {
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(exportJson);
    const exportFileDefaultName = `${title || 'Untitled'}-${new Date().toISOString().slice(0, 10)}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportJson);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsExportDialogOpen(true)}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Export Automaton</DialogTitle>
          <DialogDescription>
            Preview the automaton JSON and choose how to export it.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <CodeEditor initialValue={exportJson} mode="readonly" />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="outline" className="flex items-center gap-1" onClick={copyToClipboard}>
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
          <Button onClick={downloadJson}>Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
