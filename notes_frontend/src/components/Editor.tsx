import React, { useState } from "react";
import { Theme } from "../theme";
import type { Note } from "../theme";

type EditorProps = {
  note: Note | null;
  onChange: (patch: Partial<Pick<Note, "title" | "content">>) => void;
};

export const Editor: React.FC<EditorProps> = ({ note, onChange }) => {
  const [titleFocused, setTitleFocused] = useState(false);
  const [contentFocused, setContentFocused] = useState(false);

  const wrap: React.CSSProperties = {
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    height: "100%",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 20,
    padding: "10px 12px",
    borderRadius: Theme.radius.md,
    border: `1px solid ${Theme.colors.border}`,
    outline: "none",
    color: Theme.colors.text,
    background: Theme.colors.surface,
    transition: Theme.transition,
    boxShadow: titleFocused ? `0 0 0 3px ${Theme.colors.focus}` : Theme.shadow.sm,
  };

  const textStyle: React.CSSProperties = {
    flex: 1,
    resize: "none" as const,
    padding: "12px 14px",
    borderRadius: Theme.radius.md,
    border: `1px solid ${Theme.colors.border}`,
    outline: "none",
    color: Theme.colors.text,
    background: Theme.colors.surface,
    transition: Theme.transition,
    boxShadow: contentFocused ? `0 0 0 3px ${Theme.colors.focus}` : Theme.shadow.sm,
    lineHeight: 1.5,
    fontSize: 14,
    minHeight: 280,
  };

  if (!note) {
    return (
      <div style={wrap} aria-live="polite">
        <div
          style={{
            padding: 24,
            border: `1px dashed ${Theme.colors.border}`,
            borderRadius: Theme.radius.lg,
            color: Theme.colors.mutedText,
            background: "#fff",
          }}
        >
          Select a note from the sidebar, or create a new one.
        </div>
      </div>
    );
  }

  return (
    <div style={wrap}>
      <label style={{ fontSize: 12, color: Theme.colors.mutedText }} htmlFor="note-title">
        Title
      </label>
      <input
        id="note-title"
        aria-label="Note title"
        value={note.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Note title..."
        style={titleStyle}
        onFocus={() => setTitleFocused(true)}
        onBlur={() => setTitleFocused(false)}
      />
      <label style={{ fontSize: 12, color: Theme.colors.mutedText }} htmlFor="note-content">
        Content
      </label>
      <textarea
        id="note-content"
        aria-label="Note content"
        value={note.content}
        onChange={(e) => onChange({ content: e.target.value })}
        placeholder="Write your note content here..."
        style={textStyle}
        onFocus={() => setContentFocused(true)}
        onBlur={() => setContentFocused(false)}
      />
    </div>
  );
};
