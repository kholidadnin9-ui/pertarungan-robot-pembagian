import type { LevelConfig } from "./levels";

export interface Question {
  dividend: number;
  divisor: number;
  answer: number;
  options: number[];
}

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeOptions(answer: number): number[] {
  const set = new Set<number>([answer]);
  const near = shuffle([answer - 1, answer + 1, answer - 2, answer + 2]).filter(
    (n) => n >= 1 && n <= 10 && n !== answer
  );
  const far = shuffle([answer - 3, answer + 3, answer - 4, answer + 4]).filter(
    (n) => n >= 1 && n <= 10 && n !== answer
  );
  for (const n of [...near, ...far]) {
    if (set.size >= 3) break;
    set.add(n);
  }
  let guard = 0;
  while (set.size < 3 && guard++ < 100) set.add(randInt(1, 10));
  return shuffle([...set]);
}

export function generateQuestions(level: LevelConfig): Question[] {
  const used = new Set<string>();
  const out: Question[] = [];
  let guard = 0;
  while (out.length < level.questions && guard++ < 2000) {
    const divisor = pick(level.divisors);
    const answer = randInt(level.quotients[0], level.quotients[1]);
    const key = `${divisor}x${answer}`;
    if (used.has(key)) continue;
    used.add(key);
    out.push({
      dividend: divisor * answer,
      divisor,
      answer,
      options: makeOptions(answer),
    });
  }
  return out;
}

/** Waktu (ms) robot musuh menembak untuk setiap soal */
export function rollEnemyTimes(level: LevelConfig): number[] {
  const limit = level.timeLimit * 1000;
  return Array.from({ length: level.questions }, () => {
    const f = level.enemyMin + Math.random() * (level.enemyMax - level.enemyMin);
    return Math.round(limit * f);
  });
}
