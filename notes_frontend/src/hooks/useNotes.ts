import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Note } from "../theme";

const STORAGE_KEY = "notes_frontend.notes.v1";

type UseNotesReturn = {
  notes: Note[];
  filtered: Note[];
  selectedId: string | null;
  selected: Note | null;
  query: string;
  loading: boolean;
  error: string | null;
  setQuery: (q: string) => void;
  select: (id: string) => void;
  create: () => Note;
  update: (id: string, patch: Partial<Pick<Note, "title" | "content">>) => void;
  save: (id: string) => void; // no-op for local, exists for API parity
  remove: (id: string) => void;
  refreshFromStorage: () => void;
};

const isValidNote = (v: any): v is Note =>
  v &&
  typeof v.id === "string" &&
  typeof v.title === "string" &&
  typeof v.content === "string" &&
  typeof v.updatedAt === "number" &&
  typeof v.createdAt === "number";

const getGlobal = (): any => {
  // Use globalThis if available, else safely return undefined-like
  try {
    // eslint-disable-next-line no-undef
    return typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
  } catch {
    return undefined;
  }
};

const getLocalStorage = (): any | null => {
  const g = getGlobal();
  try {
    return g && g.localStorage ? (g.localStorage as any) : null;
  } catch {
    return null;
  }
};

const hasRandomUUID = (): boolean => {
  const g = getGlobal();
  try {
    return !!(g && g.crypto && typeof g.crypto.randomUUID === "function");
  } catch {
    return false;
  }
};

const randomId = (): string => {
  const g = getGlobal();
  if (hasRandomUUID()) {
    return g.crypto.randomUUID();
  }
  const now = Date.now();
  return `${now}-${Math.random().toString(36).slice(2)}`;
};

export const useNotes = (): UseNotesReturn => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  // Load from localStorage
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setLoading(true);
    try {
      const ls = getLocalStorage();
      if (ls) {
        const raw = ls.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const valid = parsed.filter(isValidNote);
            setNotes(valid.sort((a, b) => b.updatedAt - a.updatedAt));
            if (valid.length > 0) {
              setSelectedId(valid[0].id);
            }
          } else {
            setNotes([]);
          }
        } else {
          setNotes([]);
        }
      } else {
        setNotes([]);
      }
      setError(null);
    } catch {
      setError("Failed to load notes from localStorage.");
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      const ls = getLocalStorage();
      if (ls) {
        ls.setItem(STORAGE_KEY, JSON.stringify(notes));
      }
    } catch {
      // Ignore quota errors, but set error message for UI
      setError("Failed to save notes to localStorage.");
    }
  }, [notes]);

  const create = useCallback((): Note => {
    const now = Date.now();
    const baseTitle = "Untitled note";
    const title =
      notes.some((n) => n.title === baseTitle)
        ? `${baseTitle} ${notes.filter((n) => n.title.startsWith(baseTitle)).length + 1}`
        : baseTitle;

    const newNote: Note = {
      id: randomId(),
      title,
      content: "",
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
    setError(null);
    return newNote;
  }, [notes]);

  const select = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const update = useCallback((id: string, patch: Partial<Pick<Note, "title" | "content">>) => {
    setNotes((prev) =>
      prev
        .map((n) => (n.id === id ? { ...n, ...patch, updatedAt: Date.now() } as Note : n))
        .sort((a, b) => b.updatedAt - a.updatedAt)
    );
    setError(null);
  }, []);

  const save = useCallback((_id: string) => {
    // With localStorage, updates are already persisted through the effect.
    // This method exists to fulfill top bar UX and parity with potential future APIs.
    setError(null);
  }, []);

  const remove = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      if (selectedId === id) {
        // Select next note if exists
        const remaining = notes.filter((n) => n.id !== id);
        setSelectedId(remaining.length ? remaining[0].id : null);
      }
      setError(null);
    },
    [notes, selectedId]
  );

  const refreshFromStorage = useCallback(() => {
    try {
      const ls = getLocalStorage();
      if (!ls) return;
      const raw = ls.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const valid = parsed.filter(isValidNote);
        setNotes(valid.sort((a, b) => b.updatedAt - a.updatedAt));
        if (valid.length > 0 && (!selectedId || !valid.find((n) => n.id === selectedId))) {
          setSelectedId(valid[0].id);
        }
      }
    } catch {
      setError("Failed to refresh notes from storage.");
    }
  }, [selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        (n.content && n.content.toLowerCase().includes(q))
    );
  }, [notes, query]);

  const selected = useMemo(
    () => (selectedId ? notes.find((n) => n.id === selectedId) || null : null),
    [notes, selectedId]
  );

  return {
    notes,
    filtered,
    selectedId,
    selected,
    query,
    loading,
    error,
    setQuery,
    select,
    create,
    update,
    save,
    remove,
    refreshFromStorage,
  };
};
