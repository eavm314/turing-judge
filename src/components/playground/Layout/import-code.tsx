'use client';

import { useRef, useState } from 'react';

import { Code, FileJson, Upload } from 'lucide-react';

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
import { useToast } from '@/hooks/use-toast';
import { validateCode } from '@/lib/schemas/automaton-code';
import { useAutomaton, useIsOwner } from '@/providers/playground-provider';

const initCode = '';

export function ImportCode() {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const [initialImportJson, setInitialImportJson] = useState(initCode);
  const [importJson, setImportJson] = useState(initCode);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setAutomaton } = useAutomaton();
  const isOwner = useIsOwner();
  const { toast } = useToast();

  const codeError = validateCode(importJson);

  const handleImport = () => {
    if (codeError) return;
    try {
      const parsed = JSON.parse(importJson);
      setAutomaton(parsed);
      setInitialImportJson(initCode);
      setIsImportDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Invalid JSON for automaton',
        variant: 'destructive',
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target?.result as string;
      setInitialImportJson(content);
      setImportJson(content);
    };
    reader.readAsText(file);
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(importJson);
      setInitialImportJson(JSON.stringify(parsed, null, 2));
    } catch (error) {}
  };

  return (
    <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
      <DialogTrigger asChild>
        <Button disabled={!isOwner} variant="outline" size="sm" className="flex items-center gap-1">
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Automaton</DialogTitle>
          <DialogDescription>
            Upload a JSON file or paste JSON directly to import an automaton.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept=".json"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              ref={fileInputRef}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <FileJson className="h-4 w-4" />
                Choose File
              </Button>
            </label>

            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 ml-auto"
              onClick={formatJson}
              disabled={!importJson}
            >
              <Code className="h-4 w-4" />
              Format JSON
            </Button>
          </div>

          <CodeEditor initialValue={initialImportJson} onChange={setImportJson} />

          {codeError && <p className="text-sm text-red-500">{codeError}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
            Cancel
          </Button>
          <Button disabled={!!codeError} onClick={handleImport}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
