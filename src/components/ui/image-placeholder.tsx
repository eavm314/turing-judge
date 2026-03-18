import { ImageIcon } from 'lucide-react';

export function ImagePlaceholder({ text }: { text: string }) {
  return (
    <div className="my-8 flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl bg-muted/30 text-muted-foreground">
      <ImageIcon className="w-10 h-10 mb-4 opacity-50" />
      <span className="text-sm font-medium">Image Placeholder: {text}</span>
    </div>
  );
}
