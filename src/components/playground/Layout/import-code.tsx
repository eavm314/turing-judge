"use client";

import { useRef, useState } from "react";

import { Code, Download, FileJson } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/ui/code-editor";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { validateCode } from "@/lib/schemas/automaton-code";
import { useAutomaton } from "@/providers/playground-provider";

export function ImportCode() {
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const [initialImportJson, setInitialImportJson] = useState("{}");
  const [importJson, setImportJson] = useState("{}");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { setAutomaton } = useAutomaton();

  const codeError = validateCode(importJson);

  const handleImport = () => {
    if (codeError) return;
    const parsed = JSON.parse(importJson);
    setAutomaton(parsed);

    setIsImportDialogOpen(false);
    setInitialImportJson("{}");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
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
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Download className="h-4 w-4" />
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

        <div className="grid gap-4 py-4">
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
            <span className="text-sm text-gray-500">
              {importJson ? "File loaded" : "No file chosen"}
            </span>

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

          <CodeEditor
            initialValue={initialImportJson}
            onChange={setImportJson}
          />

          {codeError && <p className="text-sm text-red-500">{codeError}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsImportDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
