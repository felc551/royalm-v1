
import React from 'react';
import { Crown, Play, Star } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle,rgba(79,70,229,0.4)_0%,rgba(15,23,42,0)_70%)] animate-pulse-glow"></div>
      </div>

      {/* Logo Container */}
      <div className="relative z-10 flex flex-col items-center mb-12 animate-float">
        <div className="relative">
          <Crown className="w-24 h-24 text-amber-400 fill-amber-500 drop-shadow-[0_0_25px_rgba(251,191,36,0.6)]" strokeWidth={1.5} />
          <Star className="absolute -top-2 -right-4 w-8 h-8 text-white fill-white animate-bounce" />
          <Star className="absolute top-4 -left-6 w-6 h-6 text-indigo-300 fill-indigo-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mt-4 text-center leading-tight drop-shadow-lg">
          ROYAL<br/>
          <span className="text-6xl bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">MERGE</span><br/>
          KINGDOM
        </h1>
      </div>

      {/* Play Button */}
      <button 
        onClick={onStart}
        className="group relative z-10 btn-3d bg-gradient-to-b from-indigo-500 to-indigo-700 text-white text-xl font-black px-12 py-4 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.5)] border-b-indigo-900 hover:brightness-110 active:scale-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-1 rounded-full">
            <Play className="w-6 h-6 fill-current" />
          </div>
          PLAY NOW
        </div>
        <div className="absolute inset-0 rounded-2xl ring-2 ring-white/30 animate-pulse"></div>
      </button>

      <p className="absolute bottom-8 text-slate-500 text-xs font-bold tracking-widest uppercase">
        v1.0.0 • Production Release
      </p>
    </div>
  );
};
