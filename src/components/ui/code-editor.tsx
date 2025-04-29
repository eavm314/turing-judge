"use client"

import { useEffect, useRef } from "react"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { json } from "@codemirror/lang-json"
import { oneDark } from "@codemirror/theme-one-dark"
import { useTheme } from "next-themes"
import { cn } from "@/lib/ui/utils"

type CodeEditorMode = "editable" | "readonly" | "disabled";

interface CodeEditorProps {
  initialValue: string
  onChange?: (value: string) => void
  mode?: CodeEditorMode
}

export function CodeEditor({ initialValue, onChange, mode = "editable" }: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  const { theme } = useTheme();

  useEffect(() => {
    if (!editorRef.current) return

    // Clean up previous instance
    if (viewRef.current) {
      viewRef.current.destroy()
    }

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const doc = update.state.doc
        const value = doc.toString()
        onChange?.(value)
      }
    })

    const themeExtension = theme === "dark" ? oneDark : [];
    const readOnlyExtension = EditorState.readOnly.of(mode === "readonly");
    const disabledExtension = EditorView.editable.of(mode !== "disabled");

    const state = EditorState.create({
      doc: initialValue,
      extensions: [
        basicSetup,
        json(),
        EditorView.lineWrapping,
        updateListener,
        EditorView.theme({
          "&": {
            height: "100%",
            fontSize: "14px",
          },
        }),
        themeExtension,
        readOnlyExtension,
        disabledExtension,
      ],
    })

    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    viewRef.current = view

    return () => {
      view.destroy()
    }
  }, [editorRef, initialValue])

  return <div ref={editorRef} className={cn("w-full h-80", mode === 'disabled'? 'pointer-events-none select-none opacity-50': '')} />
}

