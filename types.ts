export interface ZhuyinChar {
  char: string; // The Chinese character, e.g., "貓"
  zhuyin: string[]; // Array of symbols, e.g., ["ㄇ", "ㄠ"]
  keys: string[]; // Array of corresponding keyboard keys, e.g., ["a", "l", " "] (Tone 1 is space)
  tone: string; // The tone symbol display, e.g. " " (empty for 1st), "ˊ", "ˇ", "ˋ", "˙"
}

export interface WordChallenge {
  word: string; // "貓咪"
  chars: ZhuyinChar[];
  hint?: string; // "一種會抓老鼠的動物"
}

export enum GameStatus {
  IDLE,
  PLAYING,
  COMPLETED,
  LOADING
}

export interface KeyMapping {
  [key: string]: string; // "a" -> "ㄇ"
}