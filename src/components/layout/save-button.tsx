"use client"

import { useEffect, useState } from "react";

import { SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { handleSignIn } from "@/lib/auth/client-handlers";
import { useAutomaton } from "@/providers/editor-provider";
import { useSession } from "@/providers/user-provider";
import { saveAutomaton } from "@/actions/library";

export function SaveButton() {
  const [retry, setRetry] = useState(false);

  const { automaton } = useAutomaton();
  const session = useSession();

  useEffect(() => {
    if (session && retry) {
      setRetry(false);
      handleSave();
    }
  }, [session, retry]);

  const handleSave = async () => {
    if (!session) {
      await handleSignIn();
      setRetry(true);
      return;
    }

    const title = prompt("Enter a title for the automaton:");
    if (!title) {
      alert("Automaton not saved.");
      return;
    }
    const savedAutomatonId = await saveAutomaton(title, "FSM", true, automaton.toJson());
    console.log("Automaton saved!", savedAutomatonId);
  };

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={handleSave}
    >
      <SaveIcon />
      Save
    </Button>
  );
}