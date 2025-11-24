import React, { useState } from "react";
import { Theme } from "../theme";

type TopBarProps = {
  onNew: () => void;
  onSave: () => void;
  onDelete: () => void;
  canSave: boolean;
  canDelete: boolean;
};

const btnBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "10px 14px",
  borderRadius: Theme.radius.md,
  border: `1px solid ${Theme.colors.border}`,
  background: Theme.colors.surface,
  color: Theme.colors.text,
  cursor: "pointer",
  transition: Theme.transition,
  boxShadow: Theme.shadow.sm,
  fontSize: 14,
};

export const TopBar: React.FC<TopBarProps> = ({
  onNew,
  onSave,
  onDelete,
  canSave,
  canDelete,
}) => {
  const [hoverSave, setHoverSave] = useState(false);
  const [hoverDelete, setHoverDelete] = useState(false);
  const [hoverNew, setHoverNew] = useState(false);

  const topStyle: React.CSSProperties = {
    height: 64,
    borderBottom: `1px solid ${Theme.colors.border}`,
    background: `linear-gradient(180deg, ${Theme.colors.surface}, ${Theme.colors.background})`,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    position: "sticky",
    top: 0,
    zIndex: 2,
  };

  const left: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10 };
  const right: React.CSSProperties = { display: "flex", alignItems: "center", gap: 10 };

  return (
    <header style={topStyle} aria-label="Top bar">
      <div style={left}>
        <strong style={{ color: Theme.colors.text }}>Notes</strong>
      </div>
      <div style={right}>
        <button
          onClick={onNew}
          onMouseEnter={() => setHoverNew(true)}
          onMouseLeave={() => setHoverNew(false)}
          style={{
            ...btnBase,
            borderColor: Theme.colors.primary,
            color: "#fff",
            background: Theme.colors.primary,
            filter: hoverNew ? "brightness(0.95)" : "none",
            boxShadow: hoverNew ? Theme.shadow.md : Theme.shadow.sm,
          }}
        >
          + New
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          onMouseEnter={() => setHoverSave(true)}
          onMouseLeave={() => setHoverSave(false)}
          style={{
            ...btnBase,
            opacity: canSave ? 1 : 0.6,
            borderColor: Theme.colors.secondary,
            background: "#fff7ed",
            transform: hoverSave ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          Save
        </button>
        <button
          onClick={onDelete}
          disabled={!canDelete}
          onMouseEnter={() => setHoverDelete(true)}
          onMouseLeave={() => setHoverDelete(false)}
          style={{
            ...btnBase,
            opacity: canDelete ? 1 : 0.6,
            borderColor: Theme.colors.error,
            background: "#fef2f2",
            color: "#991b1b",
            transform: hoverDelete ? "translateY(-1px)" : "translateY(0)",
          }}
        >
          Delete
        </button>
      </div>
    </header>
  );
};
