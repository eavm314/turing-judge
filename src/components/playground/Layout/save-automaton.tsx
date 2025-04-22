"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SaveIcon } from "lucide-react";

import { createAutomaton, updateAutomaton } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { handleSignIn } from "@/lib/auth/client-handlers";
import { useAutomaton } from "@/providers/playground-provider";
import { useSession } from "@/providers/user-provider";
import { useSaveAutomatonPrompt } from "@/components/modal/use-save-automaton";

export function SaveAutomaton() {
  const user = useSession();
  const { automaton } = useAutomaton();

  const [retry, setRetry] = useState(false);

  const { automatonId } = useParams<{ automatonId: string }>();
  const router = useRouter();

  const saveAutomatonPrompt = useSaveAutomatonPrompt();

  useEffect(() => {
    if (user && retry) {
      setRetry(false);
      handleSave();
    }
  }, [user, retry]);

  const handleSave = async () => {
    if (!user) {
      await handleSignIn();
      setRetry(true);
      return;
    }

    if (automatonId) {
      await updateAutomaton({
        id: automatonId,
        automaton: automaton.toJson(),
      });
      return;
    }

    const userInput = await saveAutomatonPrompt();
    if (!userInput) {
      return;
    }
    await createAutomaton({
      title: userInput.title || null,
      isPublic: userInput.isPublic,
      type: "FSM",
      automaton: automaton.toJson(),
    });
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        size="sm"
        variant="secondary"
        onClick={handleSave}
      >
        <SaveIcon size={18} />
        Save
      </Button>
    </div>
  );
}