import type { Metadata } from 'next';

import Playground from '@/components/playground';
import { AutomatonType } from '@prisma/browser';

export const metadata: Metadata = {
  title: 'Playground',
  description:
    'Build finite state machines, pushdown automata and Turing machines on an interactive canvas and run them step by step.',
};

export default async function PlaygroundPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const validType = type
    ? [AutomatonType.FSM, AutomatonType.PDA, AutomatonType.TM].includes(
        type.toUpperCase() as AutomatonType,
      )
      ? (type.toUpperCase() as AutomatonType)
      : AutomatonType.FSM
    : AutomatonType.FSM;
  return <Playground initialType={validType} />;
}
