'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { ChevronDown, Save } from 'lucide-react';

import { createProjectAction, updateProjectAction } from '@/actions/projects';
import { useSaveAutomatonPrompt } from '@/components/modal/save-automaton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useServerAction } from '@/hooks/use-server-action';
import { useAutomaton, useIsOwner } from '@/providers/playground-provider';
import { useSession } from '@/providers/user-provider';

export function SaveAutomaton() {
  const { user, setOpenSignIn } = useSession();
  const { automaton, unsavedChanges, saveChanges } = useAutomaton();
  const isOwner = useIsOwner();

  const [retry, setRetry] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const { automatonId } = useParams<{ automatonId: string }>();
  const saveAutomatonPrompt = useSaveAutomatonPrompt();
  const router = useRouter();

  const createProject = useServerAction(createProjectAction);
  const updateProject = useServerAction(updateProjectAction);

  const unsavedChangesRef = useRef(unsavedChanges);
  useEffect(() => {
    unsavedChangesRef.current = unsavedChanges;
  }, [unsavedChanges]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (unsavedChangesRef.current) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

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
    const id = await createProject.execute({
      title: userInput.title.trim() || null,
      isPublic: userInput.isPublic,
      type: 'FSM',
      automaton: automaton.toJson(),
    });
    if (id) {
      saveChanges();
      router.push(`/playground/${id}`);
    }
  };

  const handleSave = async () => {
    if (automatonId && isOwner) {
      const result = await updateProject.execute(automatonId, {
        automaton: automaton.toJson(),
      });
      if (result) saveChanges();
    } else {
      handleSaveAs();
    }
  };

  const loading = createProject.loading || updateProject.loading;

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center">
        <Button
          disabled={loading}
          size="sm"
          className="rounded-r-none border-r-0 text-sm"
          onClick={handleSave}
        >
          <Save size={18} />
          Save
        </Button>
        <DropdownMenu open={openMenu} onOpenChange={setOpenMenu}>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={loading}
              size="sm"
              className="rounded-l-none px-2 border-l border-background"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-24">
            <DropdownMenuItem onClick={handleSaveAs}>Save As...</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {unsavedChanges && (
        <span className="italic text-neutral-foreground/80">You have unsaved changes</span>
      )}
    </div>
  );
}
