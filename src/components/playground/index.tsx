'use client';

import dynamic from 'next/dynamic';

import { type Project } from '@prisma/client';
import { Loader } from 'lucide-react';

import { PlaygroundLayout } from '@/components/playground/Layout';
import SideMenu from '@/components/playground/SideMenu';
import { automatonCodeSchema } from '@/lib/schemas/automaton-code';
import { PlaygroundStoreProvider } from '@/providers/playground-provider';
import { useSession } from '@/providers/user-provider';

const LoadingCanvas = () => (
  <div className="flex-1 h-full flex items-center justify-center">
    <Loader className="animate-spin" size={60} />
  </div>
);

const Canvas = dynamic(() => import('@/components/playground/Canvas'), {
  ssr: false,
  loading: LoadingCanvas,
});

export default function Playground({ data }: { data?: Project }) {
  const { user } = useSession();
  const isOwner = data ? user?.id === data.userId : true;

  let automatonCode = null;
  if (data) {
    const parsedCode = automatonCodeSchema.safeParse({
      type: data.type,
      automaton: data.automaton,
    });
    if (parsedCode.success) {
      automatonCode = parsedCode.data;
    } else {
      console.error('Invalid automaton code:', parsedCode.error);
      console.log('Resetting to default Automaton...');
    }
  }

  return (
    <PlaygroundStoreProvider initialCode={automatonCode} isOwner={isOwner}>
      <div className="flex flex-col h-screen">
        <PlaygroundLayout data={data} />
        <main className="flex flex-1 overflow-hidden">
          <Canvas />
          <SideMenu />
        </main>
      </div>
    </PlaygroundStoreProvider>
  );
}
