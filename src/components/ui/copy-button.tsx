'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CopyButtonProps {
  text: string;
}

export function CopyButton({ text }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-2 top-2 size-8 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 z-50"
      onClick={copy}
    >
      {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
      <span className="sr-only">Copy</span>
    </Button>
  );
}
