import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css";

export const MarkdownWrapper = ({ content }: { content: string }) => {
  return (
    <div className="prose prose-headings:my-4 max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex, remarkGfm]}
        components={{
          table: ({ node, ...props }) => (
            <table
              {...props}
              className="w-fit border-collapse border border-neutral-foreground"
            >
              {props.children}
            </table>
          ),
          th: ({ node, ...props }) => (
            <th
              {...props}
              className="px-4 py-2 border border-neutral-foreground bg-accent"
            >
              {props.children}
            </th>
          ),
          td: ({ node, ...props }) => (
            <td
              {...props}
              className="px-4 py-2 border border-neutral-foreground"
            >
              {props.children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
