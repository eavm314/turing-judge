import type { MDXComponents } from 'mdx/types';
import React from 'react';
import { CopyButton } from '@/components/ui/copy-button';
import { ImagePlaceholder } from '@/components/ui/image-placeholder';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ImagePlaceholder,
    pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
      // Extract the string content from the nested <code> element for the copy button
      let textContent = '';
      if (
        React.isValidElement<{ children?: string }>(children) &&
        children.props &&
        children.props.children
      ) {
        textContent = children.props.children;
      } else if (typeof children === 'string') {
        textContent = children;
      }

      return (
        <div className="relative group rounded-lg bg-zinc-950 dark:bg-zinc-900 border border-border">
          <CopyButton text={textContent} />
          <ScrollArea className="px-4">
            <pre {...props} className="text-sm text-zinc-50 font-mono overflow-x-auto">
              {children}
            </pre>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      );
    },
    code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
      const isInline = !className;
      return (
        <code
          className={
            isInline
              ? 'px-1.5 py-0.5 rounded-md bg-muted text-primary font-mono text-sm'
              : className
          }
          {...props}
        >
          {children}
        </code>
      );
    },
  };
}
