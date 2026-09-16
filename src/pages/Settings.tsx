// Settings page
import type { GameState } from "../hooks/useGameState";

interface SettingsProps {
  state: GameState;
  dark: boolean;
  onToggleTheme: () => void;
  onToggleSound: () => void;
  onToggleAnim: () => void;
  onReset: () => void;
}

export function Settings({ state, dark, onToggleTheme, onToggleSound, onToggleAnim, onReset }: SettingsProps) {
  return (
    <div className="animate-fadeIn px-4 pt-4 pb-24">
      <div className="text-[15px] font-extrabold mb-4" style={{ color: "var(--text)" }}>⚙️ Paramètres</div>

      <SettingsRow
        label="🌙 Mode sombre"
        desc="Basculer entre thème clair et sombre"
        checked={dark}
        onChange={onToggleTheme}
      />
      <SettingsRow
        label="🔊 Sons"
        desc="Activer les effets sonores"
        checked={state.prefs.sound}
        onChange={onToggleSound}
      />
      <SettingsRow
        label="🎬 Animations"
        desc="Activer les animations légères"
        checked={state.prefs.anim}
        onChange={onToggleAnim}
      />

      <div className="text-[13px] font-extrabold mt-5 mb-3" style={{ color: "var(--text)" }}>💾 Données</div>

      <button
        onClick={() => {
          const data = JSON.stringify(state, null, 2);
          const blob = new Blob([data], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "neoquiz_progress.json";
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="w-full py-3 mb-2.5 border rounded-2xl text-sm font-bold cursor-pointer"
        style={{ background: "var(--card)", color: "var(--text)", borderColor: "var(--border)" }}
      >
        📤 Exporter la progression
      </button>

      <button
        onClick={() => {
          if (confirm("Réinitialiser toute la progression ? Cette action est irréversible.")) {
            onReset();
          }
        }}
        className="w-full py-3 border rounded-2xl text-sm font-bold cursor-pointer text-white mt-5"
        style={{ background: "#dc2626" }}
      >
        🗑️ Réinitialiser la progression
      </button>
    </div>
  );
}

function SettingsRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex justify-between items-center p-3.5 rounded-2xl border mb-2.5"
      style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}>
      <div>
        <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{label}</div>
        <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>{desc}</div>
      </div>
      <label className="relative w-[46px] h-[26px] flex-shrink-0 cursor-pointer">
        <input type="checkbox" checked={checked} onChange={onChange} className="opacity-0 w-0 h-0 absolute" />
        <span className="absolute inset-0 rounded-full transition-all duration-200"
          style={{ background: checked ? "#5b53f0" : "var(--border)" }} />
        <span className="absolute top-[3px] left-[3px] w-5 h-5 bg-white rounded-full transition-all duration-200"
          style={{ transform: checked ? "translateX(20px)" : "none" }} />
      </label>
    </div>
  );
}
