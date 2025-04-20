export function AutomatonTitle({ title }: { title: string | null }) {
  return (
    <span className={`${!title && 'italic opacity-80'}`}>{title || 'Untitled'}</span>
  );
}