import { useParams } from "next/navigation";

import { Lock, Unlock } from "lucide-react";

import { updateProjectAction } from "@/actions/projects";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useModal } from "@/providers/modal-provider";
import { useIsOwner } from "@/providers/playground-provider";

export function PublicSelect({ isPublic }: { isPublic: boolean }) {
  const { automatonId } = useParams<{ automatonId: string }>();
  const { showConfirm } = useModal();

  const isOwner = useIsOwner();

  const handleSelectChange = async (value: string) => {
    const confirmation = await showConfirm({
      title: "Change Visibility",
      message: `Are you sure you want to change the visibility to ${value}?`,
      confirmLabel: "Yes",
      cancelLabel: "No",
    });
    if (!confirmation) return;

    await updateProjectAction(automatonId, {
      isPublic: value === "public",
    });
  };
  return (
    <Select
      disabled={!isOwner}
      value={isPublic ? "public" : "private"}
      onValueChange={handleSelectChange}
    >
      <SelectTrigger className="w-28 disabled:opacity-100">
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
