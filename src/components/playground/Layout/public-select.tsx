import { useParams } from 'next/navigation';

import { Lock, Unlock } from 'lucide-react';

import { updateProjectAction } from '@/actions/projects';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useServerAction } from '@/hooks/use-server-action';
import { useModal } from '@/providers/modal-provider';
import { useIsOwner } from '@/providers/playground-provider';

export function useChangeVisibility() {
  const { automatonId } = useParams<{ automatonId: string }>();
  const { showConfirm } = useModal();
  const updateProject = useServerAction(updateProjectAction);

  return async (isPublic: boolean) => {
    const value = isPublic ? 'public' : 'private';
    const confirmation = await showConfirm({
      title: 'Change Visibility',
      message: `Are you sure you want to change the visibility to ${value}?`,
      confirmLabel: 'Yes',
      cancelLabel: 'No',
    });
    if (!confirmation) return;

    await updateProject.execute(automatonId, {
      isPublic,
    });
  };
}

export function PublicSelect({ isPublic }: { isPublic: boolean }) {
  const isOwner = useIsOwner();
  const changeVisibility = useChangeVisibility();

  return (
    <Select
      disabled={!isOwner}
      value={isPublic ? 'public' : 'private'}
      onValueChange={value => changeVisibility(value === 'public')}
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
