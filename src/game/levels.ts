export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  /** Pembagi yang boleh muncul pada level ini */
  divisors: number[];
  /** Rentang hasil bagi (1-10) */
  quotients: [number, number];
  /** Batas waktu per soal (detik) */
  timeLimit: number;
  /** Waktu robot musuh menembak, sebagai fraksi dari timeLimit (mode 1 pemain) */
  enemyMin: number;
  enemyMax: number;
  questions: number;
}

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Jalan Kota",
    subtitle: "Pembagian 1 & 2",
    divisors: [1, 2],
    quotients: [1, 10],
    timeLimit: 15,
    enemyMin: 0.7,
    enemyMax: 0.95,
    questions: 10,
  },
  {
    id: 2,
    name: "Pusat Kota",
    subtitle: "Pembagian 2 – 4",
    divisors: [2, 3, 4],
    quotients: [1, 10],
    timeLimit: 13,
    enemyMin: 0.62,
    enemyMax: 0.9,
    questions: 10,
  },
  {
    id: 3,
    name: "Jembatan Baja",
    subtitle: "Pembagian 3 – 6",
    divisors: [3, 4, 5, 6],
    quotients: [1, 10],
    timeLimit: 11,
    enemyMin: 0.58,
    enemyMax: 0.88,
    questions: 10,
  },
  {
    id: 4,
    name: "Pelabuhan",
    subtitle: "Pembagian 5 – 8",
    divisors: [5, 6, 7, 8],
    quotients: [1, 10],
    timeLimit: 10,
    enemyMin: 0.55,
    enemyMax: 0.85,
    questions: 10,
  },
  {
    id: 5,
    name: "Markas Bos",
    subtitle: "Pembagian 6 – 10",
    divisors: [6, 7, 8, 9, 10],
    quotients: [1, 10],
    timeLimit: 9,
    enemyMin: 0.5,
    enemyMax: 0.8,
    questions: 10,
  },
];

export const MAX_HP = 100;
export const BASE_DAMAGE = 10;
export const CRIT_DAMAGE = 15;
/** Jawaban lebih cepat dari fraksi waktu ini = serangan kritis */
export const CRIT_FRACTION = 0.35;
export const HINTS_PER_LEVEL = 2;
