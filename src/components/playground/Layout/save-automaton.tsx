"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { ChevronDown, Save } from "lucide-react";

import { createAutomaton, updateAutomaton } from "@/actions/projects";
import { useSaveAutomatonPrompt } from "@/components/modal/use-save-automaton";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAutomaton, useIsOwner } from "@/providers/playground-provider";
import { useSession } from "@/providers/user-provider";
import { useToast } from "@/hooks/use-toast";

export function SaveAutomaton() {
  const { user, setOpenSignIn } = useSession();
  const { automaton, unsavedChanges, saveChanges } = useAutomaton();
  const isOwner = useIsOwner();

  const [retry, setRetry] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const { automatonId } = useParams<{ automatonId: string }>();
  const saveAutomatonPrompt = useSaveAutomatonPrompt();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChanges) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  useEffect(() => {
    if (user && retry) {
      setRetry(false);
      handleSaveAs();
    }
  }, [user, retry]);

  const handleSaveAs = async () => {
    setOpenMenu(false);
    if (!user) {
      setOpenSignIn(true);
      setRetry(true);
      return;
    }

    const userInput = await saveAutomatonPrompt();
    if (!userInput) {
      return;
    }
    const id = await createAutomaton({
      title: userInput.title.trim() || null,
      isPublic: userInput.isPublic,
      type: "FSM",
      automaton: automaton.toJson(),
    });
    toast({
      title: "Your automaton has been saved successfully!",
      variant: "success",
    });
    router.push(`/playground/${id}`);
  }

  const handleSave = async () => {
    if (automatonId && isOwner) {
      await updateAutomaton({
        id: automatonId,
        automaton: automaton.toJson(),
      });
      saveChanges();
      toast({
        title: "Your automaton has been saved successfully!",
        variant: "success",
      });
    } else {
      handleSaveAs();
    }
  };

  return (
    <div className="flex items-center gap-8">
      <div className="flex items-center">
        <Button size="sm"
          className="rounded-r-none border-r-0 text-sm"
          onClick={handleSave}
        >
          <Save size={18} />
          Save
        </Button>
        <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="rounded-l-none px-2 border-l border-background">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24">
            <DropdownMenuItem onClick={handleSaveAs}>Save As...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {unsavedChanges && <span className="italic text-neutral-foreground/80">You have unsaved changes</span>}
    </div>
  );
}