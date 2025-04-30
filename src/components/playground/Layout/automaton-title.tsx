import { useParams } from "next/navigation";
import { useState } from "react";

import { updateAutomaton } from "@/actions/projects";
import { Input } from "@/components/ui/input";
import { useIsOwner } from "@/providers/playground-provider";

export function AutomatonTitle({ title }: { title: string | null }) {
  const [tempTitle, setTempTitle] = useState(title);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const { automatonId } = useParams<{ automatonId: string }>();
  const isOwner = useIsOwner();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timer);
    setTempTitle(e.target.value);

    const newTitle = e.target.value.trim() || null;
    if (title === newTitle) return;
    const newTimer = setTimeout(() => {
      updateAutomaton({
        id: automatonId,
        title: newTitle,
      });
    }, 1000);
    setTimer(newTimer);
  };
  return (
    <Input
      className="md:w-72 text-neutral-foreground placeholder:italic disabled:opacity-80"
      disabled={!isOwner}
      placeholder="Untitled"
      value={tempTitle ?? ""}
      onChange={isOwner ? handleChange : undefined}
    />
  );
}
