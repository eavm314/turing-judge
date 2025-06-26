import Playground from '@/components/playground';
import { AutomatonType } from '@prisma/client';

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
      ? type.toUpperCase() as AutomatonType
      : AutomatonType.FSM
    : AutomatonType.FSM;
  return <Playground initialType={validType} />;
}
