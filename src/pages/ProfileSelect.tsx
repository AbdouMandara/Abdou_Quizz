import { PROFILE_TYPES } from "../data/profiles";
import { soundClick } from "../utils/sounds";

interface ProfileSelectProps {
  current: string | null;
  onSelect: (type: string) => void;
}

export function ProfileSelect({ current, onSelect }: ProfileSelectProps) {
  return (
    <div className="animate-fadeIn px-4 pt-4 pb-24">
      <div className="text-[15px] font-extrabold mb-1" style={{ color: "var(--text)" }}>Quel est ton profil ?</div>
      <p className="text-[13px] mb-4" style={{ color: "var(--text-soft)" }}>
        Tu pourras en changer à tout moment depuis ton profil.
      </p>

      <div className="flex flex-col gap-3">
        {PROFILE_TYPES.map(pt => (
          <button
            key={pt.id}
            onClick={() => { soundClick(); onSelect(pt.id); }}
            className={`flex items-center gap-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${
              current === pt.id ? "border-[#5b53f0]" : ""
            }`}
            style={{
              background: "var(--card)",
              borderColor: current === pt.id ? "#5b53f0" : "var(--border)",
              boxShadow: current === pt.id ? "var(--glow)" : "var(--shadow)",
            }}
          >
            <span className="text-3xl">{pt.emoji}</span>
            <div className="text-left flex-1">
              <div className="font-extrabold text-[15px]" style={{ color: "var(--text)" }}>{pt.name}</div>
              <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>{pt.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
