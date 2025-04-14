"use client"

import { useEffect, useRef } from "react"
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { json } from "@codemirror/lang-json"
import { oneDark } from "@codemirror/theme-one-dark"
import { useTheme } from "next-themes"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
}

export function CodeEditor({ value, onChange }: CodeEditorProps) {
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
        onChange(value)
      }
    })

    const themeExtension = theme === "dark" ? oneDark : []

    const state = EditorState.create({
      doc: value,
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
  }, [editorRef])

  return <div ref={editorRef} className="w-full h-80" />
}

