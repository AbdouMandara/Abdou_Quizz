import { CATEGORIES } from "../data/categories";
import type { GameState } from "../hooks/useGameState";

interface StatsProps {
  state: GameState;
}

export function Stats({ state }: StatsProps) {
  const successRate = state.questionsAnswered > 0
    ? Math.round((state.correctAnswers / state.questionsAnswered) * 100)
    : 0;

  const categoryData = Object.entries(state.categoryStats)
    .map(([catId, stats]) => {
      const cat = CATEGORIES.find(c => c.id === catId);
      return { ...cat, ...stats, pct: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0 };
    })
    .filter(c => c.name)
    .sort((a, b) => b.total - a.total);

  const recentHistory = state.history.slice(-10).reverse();

  return (
    <div className="animate-fadeIn px-4 pt-4 pb-24">
      <div className="text-[15px] font-extrabold mb-4" style={{ color: "var(--text)" }}>📊 Statistiques</div>

      <div className="grid grid-cols-3 gap-2.5 mb-3">
        <div className="text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>{state.gamesPlayed}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Parties</div>
        </div>
        <div className="text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>{state.questionsAnswered}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Répondues</div>
        </div>
        <div className="text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>{successRate}%</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Réussite</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>{state.bestScore}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Meilleur score</div>
        </div>
        <div className="text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>🔥 {state.maxStreak}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>Série max</div>
        </div>
        <div className="text-center rounded-2xl p-3 border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
          <div className="text-lg font-extrabold" style={{ color: "#5b53f0" }}>{state.xp}</div>
          <div className="text-[11px]" style={{ color: "var(--text-soft)" }}>XP total</div>
        </div>
      </div>

      {categoryData.length > 0 && (
        <>
          <div className="text-[13px] font-extrabold mb-3" style={{ color: "var(--text)" }}>
            Réussite par catégorie
          </div>
          <div className="mb-5">
            {categoryData.slice(0, 8).map(cat => (
              <div key={cat.id} className="flex items-center gap-2 mb-2 text-xs">
                <span className="w-24 truncate" style={{ color: "var(--text)" }}>{cat.emoji} {cat.name}</span>
                <div className="flex-1 h-3.5 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: "#5b53f0" }} />
                </div>
                <span className="w-10 text-right font-bold" style={{ color: "var(--text-soft)" }}>{cat.pct}%</span>
              </div>
            ))}
          </div>
        </>
      )}

      {recentHistory.length > 0 && (
        <>
          <div className="text-[13px] font-extrabold mb-3" style={{ color: "var(--text)" }}>
            Historique récent
          </div>
          <div>
            {recentHistory.map((h, i) => {
              const cat = CATEGORIES.find(c => c.id === h.category);
              return (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-xl border mb-2"
                  style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <span className="text-lg">{cat?.emoji ?? "❓"}</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold" style={{ color: "var(--text)" }}>{cat?.name ?? h.category}</div>
                    <div className="text-[10px]" style={{ color: "var(--text-soft)" }}>
                      {h.correct}/{h.total} — {h.score} pts
                    </div>
                  </div>
                  <div className="text-[10px]" style={{ color: "var(--text-soft)" }}>
                    {new Date(h.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {state.gamesPlayed === 0 && (
        <div className="text-center py-8 rounded-2xl border"
          style={{ background: "var(--card)", borderColor: "var(--border)", borderStyle: "dashed" }}>
          <div className="text-[13px]" style={{ color: "var(--text-soft)" }}>
            Pas encore de statistiques. Joue un quiz !
          </div>
        </div>
      )}
    </div>
  );
}
