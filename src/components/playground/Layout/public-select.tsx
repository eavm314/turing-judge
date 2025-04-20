import { useParams } from "next/navigation";

import { Lock, Unlock } from "lucide-react";

import { updateAutomaton } from "@/actions/projects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useModal } from "@/providers/modal-provider";

export function PublicSelect({ isPublic, isOwner }: { isPublic: boolean, isOwner: boolean }) {
  const { automatonId } = useParams<{ automatonId: string }>();
  const { showConfirm } = useModal();

  const handleSelectChange = async (value: string) => {
    const confirmation = await showConfirm({
      title: "Change Visibility",
      message: `Are you sure you want to change the visibility to ${value}?`,
      confirmLabel: "Yes",
      cancelLabel: "No"
    });
    if (!confirmation) return;

    const result = await updateAutomaton({
      id: automatonId,
      isPublic: value === 'public'
    })
    if (result) {
      alert("Automaton visibility updated successfully.");
    } else {
      alert("Automaton visibility not updated.");
    }
  }
  return (
    <Select disabled={!isOwner}
      value={isPublic ? 'public' : 'private'}
      onValueChange={handleSelectChange}
    >
      <SelectTrigger className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public">
          <Unlock className="inline mr-2 align-[-6%]" size={14} />
          Public
        </SelectItem>
        <SelectItem value="private">
          <Lock className="inline mr-2 align-[-6%]" size={14} />
          Private
        </SelectItem>
      </SelectContent>
    </Select>
  );
}