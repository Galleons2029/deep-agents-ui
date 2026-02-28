"use client";

import "./markdown-styles.css";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { cn } from "@/lib/utils";
import { MermaidDiagram } from "@/app/components/MermaidDiagram";
import { CheckIcon, CopyIcon } from "lucide-react";

import "katex/dist/katex.min.css";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

// 复制到剪贴板 hook
const useCopyToClipboard = ({
  copiedDuration = 3000,
}: {
  copiedDuration?: number;
} = {}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (!value) return;

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), copiedDuration);
    });
  };

  return { isCopied, copyToClipboard };
};

// 代码块头部组件
const CodeHeader: React.FC<{ language?: string; code: string }> = ({
  language,
  code,
}) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard();
  const onCopy = () => {
    if (!code || isCopied) return;
    copyToClipboard(code);
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-t-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white">
      <span className="lowercase [&>span]:text-xs">{language}</span>
      <button
        onClick={onCopy}
        className="flex items-center gap-1 rounded p-1 text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white"
        title="复制代码"
      >
        {!isCopied && <CopyIcon className="size-4" />}
        {isCopied && <CheckIcon className="size-4" />}
      </button>
    </div>
  );
};

export const MarkdownContent = React.memo<MarkdownContentProps>(
  ({ content, className = "" }) => {
    return (
      <div
        className={cn(
          "markdown-content prose min-w-0 max-w-full overflow-hidden break-words text-sm leading-relaxed text-inherit [&_h1:first-child]:mt-0 [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:font-semibold [&_h2:first-child]:mt-0 [&_h2]:mb-4 [&_h2]:mt-6 [&_h2]:font-semibold [&_h3:first-child]:mt-0 [&_h3]:mb-4 [&_h3]:mt-6 [&_h3]:font-semibold [&_h4:first-child]:mt-0 [&_h4]:mb-4 [&_h4]:mt-6 [&_h4]:font-semibold [&_h5:first-child]:mt-0 [&_h5]:mb-4 [&_h5]:mt-6 [&_h5]:font-semibold [&_h6:first-child]:mt-0 [&_h6]:mb-4 [&_h6]:mt-6 [&_h6]:font-semibold [&_p:last-child]:mb-0 [&_p]:mb-4",
          className
        )}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({
              inline,
              className,
              children,
              ...props
            }: {
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
            }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const code = String(children).replace(/\n$/, "");

              // 特殊处理 mermaid 图表
              if (language === "mermaid") {
                return <MermaidDiagram chart={code} />;
              }

              return !inline && match ? (
                <>
                  <CodeHeader language={language} code={code} />
                  <SyntaxHighlighter
                    style={oneDark}
                    language={language}
                    PreTag="div"
                    className="max-w-full rounded-b-md rounded-t-none text-sm"
                    wrapLines={true}
                    wrapLongLines={true}
                    lineProps={{
                      style: {
                        wordBreak: "break-all",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                      },
                    }}
                    customStyle={{
                      margin: 0,
                      maxWidth: "100%",
                      overflowX: "auto",
                      fontSize: "0.875rem",
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </>
              ) : (
                <code
                  className="bg-surface rounded-sm px-1 py-0.5 font-mono text-[0.9em]"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            pre({
              children,
              className,
              ...props
            }: {
              children?: React.ReactNode;
              className?: string;
            }) {
              // 检查是否包含 mermaid 代码块
              const isMermaid = React.Children.toArray(children).some(
                (child: any) => {
                  return child?.props?.className?.includes("language-mermaid");
                }
              );

              // 如果是 mermaid，不应用黑色背景
              if (isMermaid) {
                return <div className="my-0">{children}</div>;
              }

              return (
                <div className="my-4 max-w-full overflow-hidden last:mb-0">
                  {children}
                </div>
              );
            },
            a({
              href,
              children,
            }: {
              href?: string;
              children?: React.ReactNode;
            }) {
              return (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary no-underline hover:underline"
                >
                  {children}
                </a>
              );
            },
            blockquote({ children }: { children?: React.ReactNode }) {
              return (
                <blockquote className="text-primary/50 my-4 border-l-4 border-border pl-4 italic">
                  {children}
                </blockquote>
              );
            },
            ul({ children }: { children?: React.ReactNode }) {
              return (
                <ul className="my-4 pl-6 [&>li:last-child]:mb-0 [&>li]:mb-1">
                  {children}
                </ul>
              );
            },
            ol({ children }: { children?: React.ReactNode }) {
              return (
                <ol className="my-4 pl-6 [&>li:last-child]:mb-0 [&>li]:mb-1">
                  {children}
                </ol>
              );
            },
            table({ children }: { children?: React.ReactNode }) {
              return (
                <div className="my-4 overflow-x-auto">
                  <table className="[&_th]:bg-surface w-full border-collapse [&_td]:border [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-border [&_th]:p-2 [&_th]:text-left [&_th]:font-semibold">
                    {children}
                  </table>
                </div>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }
);

MarkdownContent.displayName = "MarkdownContent";
