"use client"

import { type CustomContentProps, useModal } from "@/providers/modal-provider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

type SaveAutomatonValues = {
  title: string;
  isPublic: boolean;
}

const SaveAutomatonPrompt = ({ value, setValue }: CustomContentProps<SaveAutomatonValues>) => {
  useEffect(() => {
    setValue({
      title: "",
      isPublic: true
    });
  },[]);

  if (!value) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={value.title}
          placeholder="Untitled"
          onChange={e => setValue(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>
      <div className="flex items-center space-x-4">
        <Label htmlFor="public">Make Public</Label>
        <Switch id="public" checked={value.isPublic}
          onCheckedChange={checked => setValue(prev => ({ ...prev, isPublic: checked }))}
        />
      </div>
    </div>
  );
}

export const useSaveAutomatonPrompt = () => {
  const { showCustomModal } = useModal()

  const saveAutomatonPrompt = () => showCustomModal<SaveAutomatonValues>({
    title: "Save Automaton",
    message: "Are you sure you want to save this automaton?",
    confirmLabel: "Save",
    cancelLabel: "Cancel",
    inputLabel: "Title",
    customContent: SaveAutomatonPrompt,
  });

  return saveAutomatonPrompt;
}