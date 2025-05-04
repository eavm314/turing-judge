import { useParams } from "next/navigation";
import { useState } from "react";

import { updateProjectAction } from "@/actions/projects";
import { Input } from "@/components/ui/input";
import { useIsOwner } from "@/providers/playground-provider";
import { Check, Loader2 } from "lucide-react";

export function AutomatonTitle({ title }: { title: string | null }) {
  const [tempTitle, setTempTitle] = useState(title);
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  const { automatonId } = useParams<{ automatonId: string }>();

  const [editing, setEditing] = useState(false);
  const isOwner = useIsOwner();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditing(true);
    clearTimeout(timer);
    const inputTitle = e.target.value.substring(0, 30);
    setTempTitle(inputTitle);

    const newTitle = inputTitle.trim() || null;
    if (title === newTitle) {
      setEditing(false);
      return;
    }
    const newTimer = setTimeout(async () => {
      await updateProjectAction(automatonId, {
        title: newTitle,
      });
      setEditing(false);
    }, 800);
    setTimer(newTimer);
  };
  return (
    <div className="relative flex-1">
      {editing ? (
        <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 text-neutral-foreground animate-spin" />
      ) : (
        <Check className="absolute right-2.5 top-2.5 h-4 w-4 text-green-500" />
      )}
      <Input
        className="pr-8 md:w-72 md:text-base text-neutral-foreground placeholder:italic disabled:opacity-100"
        disabled={!isOwner}
        placeholder="Untitled"
        value={tempTitle ?? ""}
        onChange={isOwner ? handleChange : undefined}
      />
    </div>
  );
}
