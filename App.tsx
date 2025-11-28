import React from 'react';
import Game from './components/Game';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col">
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 py-6 md:py-10">
        <Game />
      </main>
      <footer className="text-center py-4 text-slate-300 text-xs font-bold uppercase tracking-widest">
        ㄅㄆㄇ Typing Practice • {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;