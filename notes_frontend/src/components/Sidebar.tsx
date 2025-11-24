import React, { useMemo, useState } from "react";
import { Theme } from "../theme";
import type { Note } from "../theme";

type SidebarProps = {
  notes: Note[];
  filtered: Note[];
  query: string;
  setQuery: (q: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({
  notes,
  filtered,
  query,
  setQuery,
  selectedId,
  onSelect,
}) => {
  const hasNotes = notes.length > 0;
  const list = filtered;

  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const containerStyle: React.CSSProperties = {
    width: 320,
    minWidth: 280,
    maxWidth: 360,
    height: "100%",
    borderRight: `1px solid ${Theme.colors.border}`,
    background: `linear-gradient(180deg, ${Theme.colors.gradientFrom}, ${Theme.colors.gradientTo})`,
    display: "flex",
    flexDirection: "column",
  };

  const searchWrap: React.CSSProperties = {
    padding: 12,
    borderBottom: `1px solid ${Theme.colors.border}`,
    background: Theme.colors.surface,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: Theme.radius.md,
    border: `1px solid ${Theme.colors.border}`,
    outline: "none",
    fontSize: 14,
    color: Theme.colors.text,
    transition: Theme.transition,
    background: "#fff",
    boxShadow: searchFocused ? `0 0 0 3px ${Theme.colors.focus}` : "none",
  };

  const listStyle: React.CSSProperties = {
    flex: 1,
    overflowY: "auto",
    padding: 8,
  };

  const emptyStyle: React.CSSProperties = {
    color: Theme.colors.mutedText,
    fontSize: 14,
    padding: 16,
  };

  const itemBase: React.CSSProperties = useMemo(
    () => ({
      display: "block",
      width: "100%",
      textAlign: "left" as const,
      padding: "10px 12px",
      margin: "6px 4px",
      borderRadius: Theme.radius.md,
      border: `1px solid transparent`,
      background: Theme.colors.surface,
      cursor: "pointer",
      transition: Theme.transition,
      color: Theme.colors.text,
      boxShadow: Theme.shadow.sm,
    }),
    []
  );

  const handleKey = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <aside style={containerStyle} aria-label="Notes sidebar">
      <div style={searchWrap}>
        <input
          aria-label="Search notes"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={inputStyle}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>
      <div style={listStyle} role="list">
        {!hasNotes ? (
          <div style={emptyStyle}>No notes yet. Create your first note.</div>
        ) : list.length === 0 ? (
          <div style={emptyStyle}>No notes match your search.</div>
        ) : (
          list.map((n) => {
            const isSelected = n.id === selectedId;
            const isHovered = hoveredId === n.id;
            const style: React.CSSProperties = {
              ...itemBase,
              borderColor: isSelected ? Theme.colors.primary : "transparent",
              background: isSelected
                ? "rgba(37,99,235,0.08)"
                : Theme.colors.surface,
              transform: isHovered ? "translateY(-1px)" : "translateY(0)",
              boxShadow: isHovered ? Theme.shadow.md : Theme.shadow.sm,
            };
            return (
              <button
                key={n.id}
                role="listitem"
                aria-current={isSelected}
                onClick={() => onSelect(n.id)}
                onKeyDown={(e) => handleKey(e, n.id)}
                style={style}
                onMouseEnter={() => setHoveredId(n.id)}
                onMouseLeave={() => setHoveredId((prev) => (prev === n.id ? null : prev))}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                    fontSize: 13,
                    color: Theme.colors.mutedText,
                  }}
                >
                  <span>{new Date(n.updatedAt).toLocaleString()}</span>
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    color: Theme.colors.text,
                    marginBottom: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                  title={n.title || "Untitled"}
                >
                  {n.title || "Untitled"}
                </div>
                {n.content ? (
                  <div
                    style={{
                      fontSize: 13,
                      color: Theme.colors.mutedText,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={n.content}
                  >
                    {n.content}
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: 13,
                      color: Theme.colors.mutedText,
                      fontStyle: "italic",
                    }}
                  >
                    No content
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
