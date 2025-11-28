import { KeyMapping, WordChallenge } from './types';

// Standard Daqian (Standard) Zhuyin Layout
export const KEY_TO_ZHUYIN: KeyMapping = {
  '1': 'ㄅ', 'q': 'ㄆ', 'a': 'ㄇ', 'z': 'ㄈ',
  '2': 'ㄉ', 'w': 'ㄊ', 's': 'ㄋ', 'x': 'ㄌ',
  '3': 'ˇ', 'e': 'ㄍ', 'd': 'ㄎ', 'c': 'ㄏ',
  '4': 'ˋ', 'r': 'ㄐ', 'f': 'ㄑ', 'v': 'ㄒ',
  '5': 'ㄓ', 't': 'ㄔ', 'g': 'ㄕ', 'b': 'ㄖ',
  '6': 'ˊ', 'y': 'ㄗ', 'h': 'ㄘ', 'n': 'ㄙ',
  '7': '˙', 'u': 'ㄧ', 'j': 'ㄨ', 'm': 'ㄩ',
  '8': 'ㄚ', 'i': 'ㄛ', 'k': 'ㄜ', ',': 'ㄝ',
  '9': 'ㄞ', 'o': 'ㄟ', 'l': 'ㄠ', '.': 'ㄡ',
  '0': 'ㄢ', 'p': 'ㄣ', ';': 'ㄤ', '/': 'ㄥ',
  '-': 'ㄦ', ' ': ' ' // Space is Tone 1
};

export const ZHUYIN_TO_KEY: KeyMapping = Object.entries(KEY_TO_ZHUYIN).reduce((acc, [key, val]) => {
  acc[val] = key;
  return acc;
}, {} as KeyMapping);

export const KEYBOARD_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\''],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/']
];

export const FALLBACK_WORDS: WordChallenge[] = [
  {
    word: "小貓",
    chars: [
      { char: "小", zhuyin: ["ㄒ", "ㄧ", "ㄠ", "ˇ"], keys: ["v", "u", "l", "3"], tone: "ˇ" },
      { char: "貓", zhuyin: ["ㄇ", "ㄠ"], keys: ["a", "l", " "], tone: " " }
    ],
    hint: "喜歡抓老鼠"
  },
  {
    word: "蘋果",
    chars: [
      { char: "蘋", zhuyin: ["ㄆ", "ㄧ", "ㄣ", "ˊ"], keys: ["q", "u", "p", "6"], tone: "ˊ" },
      { char: "果", zhuyin: ["ㄍ", "ㄨ", "ㄛ", "ˇ"], keys: ["e", "j", "i", "3"], tone: "ˇ" }
    ],
    hint: "紅色的水果"
  },
  {
    word: "氣球",
    chars: [
      { char: "氣", zhuyin: ["ㄑ", "ㄧ", "ˋ"], keys: ["f", "u", "4"], tone: "ˋ" },
      { char: "球", zhuyin: ["ㄑ", "ㄧ", "ㄡ", "ˊ"], keys: ["f", "u", ".", "6"], tone: "ˊ" }
    ],
    hint: "會飄在空中的玩具"
  }
];