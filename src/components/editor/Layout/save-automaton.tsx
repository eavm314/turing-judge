"use client"

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SaveIcon } from "lucide-react";

import { createAutomaton, updateAutomaton } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { handleSignIn } from "@/lib/auth/client-handlers";
import { useAutomaton } from "@/providers/editor-provider";
import { useSession } from "@/providers/user-provider";

export function SaveAutomaton() {
  const user = useSession();
  const { automaton } = useAutomaton();

  const [retry, setRetry] = useState(false);

  const { automatonId } = useParams<{ automatonId: string }>();

  const router = useRouter();

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
      const result = await updateAutomaton({
        id: automatonId,
        automaton: automaton.toJson(),
      });
      if (result) {
        alert("Automaton saved successfully.");
      } else {
        alert("Automaton not saved.");
      }
      return;
    }

    const newTitle = prompt("Enter a title for the automaton:");
    if (!newTitle) {
      alert("Automaton not saved.");
      return;
    }
    const savedAutomatonId = await createAutomaton({
      title: newTitle,
      type: "FSM",
      isPublic: true,
      automaton: automaton.toJson(),
    });
    if (savedAutomatonId) {
      router.push(`/editor/${savedAutomatonId}`);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        size="sm"
        variant="secondary"
        onClick={handleSave}
      >
        <SaveIcon />
        Save
      </Button>
    </div>
  );
}