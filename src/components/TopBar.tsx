import { soundClick } from "../utils/sounds";

interface TopBarProps {
  title: string;
  dark: boolean;
  onToggleTheme: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export function TopBar({ title, dark, onToggleTheme, showBack = false, onBack }: TopBarProps) {
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 glass"
      style={{ background: "var(--card)", borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2">
        {showBack && onBack ? (
          <button
            onClick={() => { soundClick(); onBack(); }}
            className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer border-none"
            style={{ background: "var(--bg)", color: "var(--text)" }}
            aria-label="Retour"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        ) : (
          <span className="text-lg">🧠</span>
        )}
        <h1 className="text-base font-bold tracking-wide m-0"
          style={{ color: "var(--text)" }}>
          {title}
        </h1>
      </div>
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
