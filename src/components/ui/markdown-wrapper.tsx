import ReactMarkdown from "react-markdown"
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export const MarkdownWrapper = ({ content }: { content: string }) => {
  return (
    <div className="prose prose-headings:my-4 prose-headings:p-0 max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}