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
  const shared = { width, height, ...props };

  return (
    <>
      <Image {...shared} alt={alt} src={light} className={cn('dark:hidden', className)} />
      <Image {...shared} alt={alt} src={dark} className={cn('hidden dark:block', className)} />
    </>
  );
}
