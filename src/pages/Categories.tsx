import { CATEGORIES } from "../data/categories";
import { getNormalizedBank } from "../utils/quiz";
import { soundClick } from "../utils/sounds";

interface CategoriesProps {
  onSelect: (categoryId: string) => void;
}

export function Categories({ onSelect }: CategoriesProps) {
  const bank = getNormalizedBank();

  const getCount = (catId: string) => {
    if (catId === "mixte") return bank.length;
    return bank.filter(q => q.category === catId).length;
  };

  return (
    <div className="px-4 pt-4 pb-24">
      <div className="text-[15px] font-extrabold mb-4" style={{ color: "var(--text)" }}>
        Choisis une catégorie
      </div>
      <div className="grid grid-cols-2 gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { soundClick(); onSelect(cat.id); }}
            className="flex flex-col items-center rounded-2xl p-4 border cursor-pointer transition-all duration-150 active:scale-95"
            style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
          >
            <span className="text-3xl">{cat.emoji}</span>
            <span className="text-[13px] font-bold mt-1.5" style={{ color: "var(--text)" }}>{cat.name}</span>
            <span className="text-[11px]" style={{ color: "var(--text-soft)" }}>{getCount(cat.id)} questions</span>
          </button>
        ))}
      </div>
    </div>
  );
}
