import React, { useMemo, useState } from "react";
import { Theme } from "./theme";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { Editor } from "./components/Editor";
import { useNotes } from "./hooks/useNotes";

const shimmer: React.CSSProperties = {
  background: `linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 37%, #f3f4f6 63%)`,
  animation: "shimmer 1.2s infinite",
  backgroundSize: "400% 100%",
};

export const NotesApp: React.FC = () => {
  const {
    notes,
    filtered,
    selectedId,
    selected,
    query,
    setQuery,
    loading,
    error,
    select,
    create,
    update,
    save,
    remove,
  } = useNotes();

  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const app: React.CSSProperties = {
    height: "100%",
    width: "100%",
    background: Theme.colors.background,
    color: Theme.colors.text,
    display: "flex",
  };

  const main: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  const content: React.CSSProperties = {
    flex: 1,
    display: "flex",
    minHeight: 0,
  };

  const confirmWrap: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(17,24,39,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  };

  const confirmCard: React.CSSProperties = {
    width: "90%",
    maxWidth: 420,
    background: Theme.colors.surface,
    borderRadius: Theme.radius.lg,
    boxShadow: Theme.shadow.lg,
    padding: 20,
    border: `1px solid ${Theme.colors.border}`,
  };

  const errorBanner: React.CSSProperties = {
    margin: "8px 16px 0",
    padding: "10px 12px",
    background: "#fef2f2",
    color: "#991b1b",
    border: `1px solid ${Theme.colors.error}`,
    borderRadius: Theme.radius.md,
  };

  const canSave = useMemo(() => !!selectedId, [selectedId]);
  const canDelete = useMemo(() => !!selectedId, [selectedId]);

  const onNew = () => {
    create();
  };

  const onSave = () => {
    if (selectedId) save(selectedId);
  };

  const onDelete = () => {
    if (!selectedId) return;
    setPendingDelete(selectedId);
  };

  const confirmDelete = (ok: boolean) => {
    const id = pendingDelete;
    setPendingDelete(null);
    if (ok && id) {
      remove(id);
    }
  };

  return (
    <div style={app}>
      <style>
        {`@keyframes shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}`}
      </style>
      <Sidebar
        notes={notes}
        filtered={filtered}
        query={query}
        setQuery={setQuery}
        selectedId={selectedId}
        onSelect={select}
      />
      <div style={main}>
        <TopBar onNew={onNew} onSave={onSave} onDelete={onDelete} canSave={canSave} canDelete={canDelete} />
        {error && <div role="alert" style={errorBanner}>{error}</div>}
        <div style={content}>
          {loading ? (
            <div style={{ padding: 16, width: "100%" }}>
              <div style={{ height: 44, borderRadius: 10, ...shimmer }} />
              <div style={{ height: 14, width: "30%", marginTop: 10, borderRadius: 8, ...shimmer }} />
              <div style={{ height: 200, marginTop: 16, borderRadius: 10, ...shimmer }} />
            </div>
          ) : (
            <Editor
              note={selected}
              onChange={(patch) => {
                if (!selectedId) return;
                // basic input validation: trim excessively long content silently
                const normPatch = { ...patch };
                if (typeof normPatch.title === "string" && normPatch.title.length > 200) {
                  normPatch.title = normPatch.title.slice(0, 200);
                }
                if (typeof normPatch.content === "string" && normPatch.content.length > 100000) {
                  normPatch.content = normPatch.content.slice(0, 100000);
                }
                update(selectedId, normPatch);
              }}
            />
          )}
        </div>
      </div>

      {pendingDelete && (
        <div style={confirmWrap} role="dialog" aria-modal="true" aria-label="Confirm delete">
          <div style={confirmCard}>
            <div style={{ fontWeight: 600, marginBottom: 8, color: Theme.colors.text }}>
              Delete note?
            </div>
            <div style={{ color: Theme.colors.mutedText, marginBottom: 16 }}>
              This action cannot be undone.
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button
                onClick={() => confirmDelete(false)}
                style={{
                  padding: "8px 12px",
                  borderRadius: Theme.radius.md,
                  background: Theme.colors.surface,
                  border: `1px solid ${Theme.colors.border}`,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(true)}
                style={{
                  padding: "8px 12px",
                  borderRadius: Theme.radius.md,
                  background: Theme.colors.error,
                  color: "#fff",
                  border: `1px solid ${Theme.colors.error}`,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
