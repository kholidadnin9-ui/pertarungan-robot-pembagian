import { LEVELS } from "./levels";

export interface Progress {
  /** Level tertinggi yang terbuka (1..5) */
  unlocked: number;
  /** Bintang per level (indeks 0..4) */
  stars: number[];
  coins: number;
  bestScore: number;
  wins: number;
}

const KEY = "robot_battle_pembagian_v1";

export function defaultProgress(): Progress {
  return { unlocked: 1, stars: LEVELS.map(() => 0), coins: 0, bestScore: 0, wins: 0 };
}

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgress();
    const p = JSON.parse(raw) as Partial<Progress>;
    const d = defaultProgress();
    return {
      unlocked: Math.min(LEVELS.length, Math.max(1, p.unlocked ?? d.unlocked)),
      stars: LEVELS.map((_, i) => p.stars?.[i] ?? 0),
      coins: p.coins ?? 0,
      bestScore: p.bestScore ?? 0,
      wins: p.wins ?? 0,
    };
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(p: Progress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function clearProgress() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
