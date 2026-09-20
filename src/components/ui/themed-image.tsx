'use client';

import { useState } from 'react';

import Image, { type ImageProps } from 'next/image';

import { cn } from '@/lib/ui/utils';

type ThemedImageProps = Omit<ImageProps, 'src'> & {
  light: string;
  dark: string;
};

export function ThemedImage({
  light,
  dark,
  alt,
  width = 1600,
  height = 900,
  className,
  ...props
}: ThemedImageProps) {
  const shared = { alt, width, height, ...props };

  return (
    <>
      <PendingImage {...shared} src={light} className={cn('dark:hidden', className)} />
      <PendingImage {...shared} src={dark} className={cn('hidden dark:block', className)} />
    </>
  );
}

function PendingImage({ alt, className, ...props }: ImageProps) {
  const [pending, setPending] = useState(true);
  const settle = () => setPending(false);

  return (
    <Image
      {...props}
      alt={alt}
      ref={image => {
        if (image?.complete) settle();
      }}
      onLoad={settle}
      onError={settle}
      className={cn(
        pending && 'animate-pulse bg-neutral-foreground/10 motion-reduce:animate-none',
        className,
      )}
    />
  );
}
