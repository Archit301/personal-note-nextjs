// components/TipTapEditor.js
"use client";
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";

const TipTapEditor = ({ content, setContent }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontFamily.configure({
        types: ['textStyle'],
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  const fontFamilies = [
    "Arial", "Verdana", "Times New Roman", "Georgia", "Courier New", "Roboto", 
    "Lato", "Monospace", "Comic Sans MS", "Trebuchet MS", "Garamond", "Serif",
    "Helvetica", "Impact", "Tahoma", "Calibri", "Century Gothic", "Futura",
    "Franklin Gothic", "Lucida Sans", "Sans-Serif", "Palatino", "Open Sans",
    "Baskerville", "Copperplate"
  ];

  const colors = [
    "black", "gray", "red", "orange", "yellow", "green", "blue", "indigo", 
    "violet", "purple", "pink", "brown", "#ff5722", "#795548", "#607d8b", 
    "#009688", "#3f51b5", "#e91e63", "#673ab7", "#cddc39", "#ff9800"
  ];

  return (
    <div className="border p-4 rounded bg-gray-50 shadow-md">
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Text Formatting Buttons */}
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold transition">Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold transition">Italic</button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold transition">Underline</button>

        {/* Font Family Selector */}
        <select
          onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          className="px-3 py-1 bg-gray-200 rounded font-semibold"
        >
          <option value="">Font Family</option>
          {fontFamilies.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>

        {/* Color Selector */}
        <select
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          className="px-3 py-1 bg-gray-200 rounded font-semibold"
        >
          <option value="">Font Color</option>
          {colors.map((color) => (
            <option key={color} value={color} style={{ color }}>{color}</option>
          ))}
        </select>
      </div>

      <EditorContent editor={editor} className="border rounded p-4 bg-white" />
    </div>
  );
};

export default TipTapEditor;
