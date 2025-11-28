import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WordChallenge, GameStatus } from '../types';
import { KEY_TO_ZHUYIN, FALLBACK_WORDS } from '../constants';
import VirtualKeyboard from './VirtualKeyboard';
import { fetchNewWords } from '../services/geminiService';
import { Sparkles, RefreshCw, Trophy, Volume2, Gamepad2 } from 'lucide-react';

const Game: React.FC = () => {
  const [words, setWords] = useState<WordChallenge[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [typedKeys, setTypedKeys] = useState<string[]>([]); // Keys typed for the current CHAR
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [topic, setTopic] = useState("水果");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // Load initial words
  useEffect(() => {
    // Start with fallback for instant load
    setWords(FALLBACK_WORDS);
  }, []);

  const loadNewWords = async () => {
    setLoading(true);
    setGameStatus(GameStatus.LOADING);
    const newWords = await fetchNewWords(topic);
    if (newWords.length > 0) {
      setWords(newWords);
    } else {
      // If API fails or no key, just shuffle fallback
      const shuffled = [...FALLBACK_WORDS].sort(() => 0.5 - Math.random());
      setWords(shuffled);
    }
    resetProgress();
    setLoading(false);
    setGameStatus(GameStatus.PLAYING);
  };

  const resetProgress = () => {
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setCurrentKeyIndex(0);
    setTypedKeys([]);
    setScore(0);
  };

  const currentWord = words[currentWordIndex];
  const currentChar = currentWord?.chars[currentCharIndex];
  // Determine which key is expected next
  const expectedKey = currentChar?.keys[currentKeyIndex];

  const playSound = (type: 'correct' | 'complete') => {
    // Simple synth feedback
    if ('speechSynthesis' in window && type === 'complete') {
       const u = new SpeechSynthesisUtterance(currentWord.word);
       u.lang = 'zh-TW';
       u.rate = 0.8;
       window.speechSynthesis.speak(u);
    }
  };
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameStatus !== GameStatus.PLAYING || !currentWord) return;

    const key = e.key.toLowerCase();
    
    // Ignore meta keys
    if (['shift', 'control', 'alt', 'meta'].includes(key)) return;

    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);

    if (key === expectedKey) {
      // Correct Key
      setFeedback('correct');
      setTimeout(() => setFeedback(null), 200);
      
      const newTypedKeys = [...typedKeys, key];
      setTypedKeys(newTypedKeys);
      
      // Advance Key Index
      if (currentKeyIndex + 1 < currentChar.keys.length) {
        setCurrentKeyIndex(prev => prev + 1);
      } else {
        // Character Completed
        setTypedKeys([]); // Reset typed keys for next char
        setCurrentKeyIndex(0);

        if (currentCharIndex + 1 < currentWord.chars.length) {
          setCurrentCharIndex(prev => prev + 1);
        } else {
          // Word Completed
          setScore(s => s + 10);
          playSound('complete');
          
          if (currentWordIndex + 1 < words.length) {
            setTimeout(() => {
              setCurrentWordIndex(prev => prev + 1);
              setCurrentCharIndex(0);
            }, 800); // Small pause to celebrate word completion
          } else {
             setGameStatus(GameStatus.COMPLETED);
          }
        }
      }
    } else {
      // Wrong Key
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 200);
    }
  }, [gameStatus, currentWord, expectedKey, currentKeyIndex, currentCharIndex, currentWordIndex, words, typedKeys]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (gameStatus === GameStatus.LOADING) {
    return (
      <div className="flex flex-col items-center justify-center h-96 animate-pulse">
        <RefreshCw className="w-16 h-16 text-pink-400 animate-spin mb-4" />
        <h2 className="text-2xl text-pink-600 font-bold">正在製作新的題目...</h2>
      </div>
    );
  }

  if (gameStatus === GameStatus.COMPLETED) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Trophy className="w-32 h-32 text-yellow-400 mb-6 drop-shadow-lg" />
        <h2 className="text-4xl font-bold text-slate-700 mb-4">太棒了！練習完成！</h2>
        <p className="text-2xl text-pink-500 font-bold mb-8">總分: {score}</p>
        <button 
          onClick={loadNewWords}
          className="bg-pink-400 hover:bg-pink-500 text-white text-xl font-bold py-4 px-12 rounded-full shadow-lg transition transform hover:scale-105"
        >
          再來一次
        </button>
      </div>
    );
  }

  if (gameStatus === GameStatus.IDLE) {
     return (
       <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border-4 border-sky-200 transform rotate-1">
             <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-sky-400 tracking-wider">
               注音打字
             </h1>
             <p className="text-slate-400 mt-2 text-xl">快樂學 ㄅㄆㄇ</p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-xs">
            <label className="text-left text-slate-500 font-bold ml-2">選擇主題：</label>
            <input 
              type="text" 
              value={topic} 
              onChange={(e) => setTopic(e.target.value)}
              className="border-4 border-sky-200 rounded-2xl p-3 text-lg text-center outline-none focus:border-pink-300 transition"
              placeholder="例如: 動物, 水果..."
            />
            <button 
              onClick={loadNewWords}
              className="bg-sky-400 hover:bg-sky-500 text-white text-2xl font-bold py-4 rounded-2xl shadow-lg transition transform hover:scale-[1.02] flex items-center justify-center gap-3"
            >
              <Gamepad2 className="w-8 h-8" />
              開始遊戲
            </button>
          </div>
       </div>
     )
  }

  // PLAYING STATE
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-2 sm:p-4 h-full">
      {/* Header Bar */}
      <div className="w-full flex justify-between items-center mb-4 sm:mb-8 px-4">
         <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border-2 border-slate-100">
           <Trophy className="w-5 h-5 text-yellow-500" />
           <span className="font-bold text-slate-600">{score} 分</span>
         </div>
         <div className="flex gap-2">
            <button onClick={() => playSound('complete')} className="p-2 bg-white rounded-full hover:bg-slate-50 transition border-2 border-slate-100 text-slate-400">
               <Volume2 className="w-5 h-5" />
            </button>
         </div>
      </div>

      {/* Main Card */}
      <div className="relative bg-white w-full rounded-[2.5rem] shadow-2xl border-b-8 border-r-8 border-pink-200 p-6 sm:p-10 mb-6 sm:mb-8 flex flex-col items-center min-h-[250px] justify-center overflow-hidden">
        
        {/* Progress Bar Top */}
        <div className="absolute top-0 left-0 h-3 bg-pink-400 transition-all duration-500" style={{ width: `${((currentWordIndex) / words.length) * 100}%`}}></div>

        {/* Floating Feedback Overlay */}
        {feedback === 'correct' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <Sparkles className="w-48 h-48 text-yellow-300 animate-ping opacity-75" />
          </div>
        )}
        {feedback === 'wrong' && (
           <div className="absolute inset-0 bg-red-100 opacity-20 animate-pulse pointer-events-none z-10"></div>
        )}

        <div className="flex flex-col items-center gap-6 z-0">
          {/* The Big Word */}
          <div className="flex items-end gap-6 sm:gap-8">
            {currentWord.chars.map((charData, idx) => {
              const isCompletedChar = idx < currentCharIndex;
              const isCurrentChar = idx === currentCharIndex;
              
              return (
                <div key={idx} className={`flex flex-col items-center transition-all duration-300 ${isCurrentChar ? 'scale-110' : isCompletedChar ? 'opacity-50' : 'opacity-30'}`}>
                  {/* Zhuyin Vertical Layout */}
                  <div className="flex flex-row-reverse sm:flex-col text-sm sm:text-xl font-bold text-slate-500 mb-2 min-h-[3rem] justify-end">
                    <span className="text-pink-500">{charData.tone.trim() || ''}</span>
                    <div className="flex flex-col">
                       {charData.zhuyin.map((z, zIdx) => {
                         // Check if this specific symbol has been typed yet
                         // logic: we need to map the keys typed so far to these symbols.
                         // This is tricky because `charData.keys` corresponds to `charData.zhuyin` roughly, 
                         // but standard zhuyin input is 1-to-1.
                         // Let's rely on simple index.
                         // Standard Zhuyin Tone is always last. 
                         // If we are on this Char:
                         let isSymbolTyped = false;
                         if (isCompletedChar) isSymbolTyped = true;
                         else if (isCurrentChar) {
                            // Find which visual symbol this corresponds to.
                            // We know `charData.keys` maps to input sequence.
                            // `charData.zhuyin` is visual.
                            // usually keys.length == zhuyin.length OR keys.length == zhuyin.length + 1 (tone 1 space)
                            // Let's just highlight all if completed.
                            // For partial progress, it's hard to map exactly without strict index map, 
                            // but usually they match order.
                            if (zIdx < currentKeyIndex) isSymbolTyped = true;
                         }

                         return (
                           <span key={zIdx} className={`${isSymbolTyped ? 'text-sky-500' : 'text-slate-300'}`}>
                             {z}
                           </span>
                         )
                       })}
                    </div>
                  </div>
                  {/* Chinese Char */}
                  <div className="text-6xl sm:text-8xl font-black text-slate-700 bg-slate-50 rounded-2xl p-2 sm:p-4 border-4 border-slate-100">
                    {charData.char}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-slate-400 text-lg sm:text-xl bg-slate-100 px-4 py-1 rounded-full">
            {currentWord.hint}
          </div>
        </div>
      </div>

      {/* Keyboard */}
      <div className="w-full max-w-3xl">
        <VirtualKeyboard activeKey={expectedKey || null} pressedKey={pressedKey} />
      </div>

      <div className="mt-6 text-slate-400 text-sm font-bold">
        請使用實體鍵盤對照螢幕輸入喔！
      </div>
    </div>
  );
};

export default Game;