import { soundClick } from "../utils/sounds";

interface TopBarProps {
  title: string;
  dark: boolean;
  onToggleTheme: () => void;
}

export function TopBar({ title, dark, onToggleTheme }: TopBarProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 glass"
      style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
      <h1 className="text-base font-bold tracking-wide flex items-center gap-2 m-0"
        style={{ color: "var(--text)" }}>
        <span className="text-lg">🧠</span> {title}
      </h1>
      <button
        onClick={() => { soundClick(); onToggleTheme(); }}
        className="w-10 h-10 flex items-center justify-center rounded-xl text-lg cursor-pointer border-none"
        style={{ background: "var(--bg)", color: "var(--text)" }}
        aria-label="Changer de thème"
      >
        {dark ? "☀️" : "🌙"}
      </button>
    </div>
  );
}
