export const Theme = {
  name: "Ocean Professional",
  colors: {
    primary: "#2563EB",
    secondary: "#F59E0B",
    success: "#F59E0B",
    error: "#EF4444",
    background: "#f9fafb",
    surface: "#ffffff",
    text: "#111827",
    mutedText: "#6B7280",
    border: "#E5E7EB",
    focus: "#93C5FD",
    gradientFrom: "rgba(59,130,246,0.1)", // blue-500/10
    gradientTo: "#f9fafb", // gray-50
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 14,
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.06)",
    md: "0 4px 8px rgba(0,0,0,0.08)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
  },
  transition: "all 180ms ease",
};

export type Note = {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  createdAt: number;
};
