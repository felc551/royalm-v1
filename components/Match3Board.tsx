
import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Shield, Sword, Zap, Star } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Match3BoardProps {
  moves: number;
  targetScore: number;
  difficulty: string;
  onComplete: (success: boolean, score: number) => void;
  onExit: () => void;
}

const ROWS = 7;
const COLS = 6; // Slightly narrower for mobile

// Shapes for Gems (SVG)
const GEM_TYPES = [
  { color: 'bg-red-500', border: 'border-red-700', icon: <Sword className="w-3/4 h-3/4 text-red-900" fill="currentColor" /> }, // Sword (Attack)
  { color: 'bg-blue-500', border: 'border-blue-700', icon: <Shield className="w-3/4 h-3/4 text-blue-900" fill="currentColor" /> }, // Shield (Defend)
  { color: 'bg-emerald-500', border: 'border-emerald-700', icon: <Zap className="w-3/4 h-3/4 text-emerald-900" fill="currentColor" /> }, // Energy (Zap)
  { color: 'bg-amber-400', border: 'border-amber-600', icon: <Star className="w-3/4 h-3/4 text-amber-800" fill="currentColor" /> }, // Gold (Coin)
  { color: 'bg-purple-500', border: 'border-purple-700', icon: <div className="w-3/4 h-3/4 rounded-full border-4 border-purple-900 bg-purple-300"></div> }, // Potion
];

export const Match3Board: React.FC<Match3BoardProps> = ({ moves: initialMoves, targetScore, difficulty, onComplete, onExit }) => {
  const [board, setBoard] = useState<number[][]>([]);
  const [selected, setSelected] = useState<{r: number, c: number} | null>(null);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(initialMoves);
  const [isProcessing, setIsProcessing] = useState(false);
  const [matchedCells, setMatchedCells] = useState<string[]>([]);
  const [startScreen, setStartScreen] = useState(true);
  
  // Initialize
  useEffect(() => {
    const newBoard = [];
    for(let r=0; r<ROWS; r++) {
        const row = [];
        for(let c=0; c<COLS; c++) row.push(Math.floor(Math.random() * GEM_TYPES.length));
        newBoard.push(row);
    }
    setBoard(newBoard);
  }, []);

  const handleInteraction = async (r: number, c: number) => {
    if (isProcessing || movesLeft <= 0) return;
    playSound('pop');

    if (!selected) {
      setSelected({ r, c });
      return;
    }

    if (selected.r === r && selected.c === c) {
        setSelected(null);
        return;
    }

    const isAdj = Math.abs(selected.r - r) + Math.abs(selected.c - c) === 1;
    
    if (isAdj) {
        setIsProcessing(true);
        const temp = JSON.parse(JSON.stringify(board));
        // Swap
        const val = temp[selected.r][selected.c];
        temp[selected.r][selected.c] = temp[r][c];
        temp[r][c] = val;
        
        setBoard(temp);
        setSelected(null);

        await new Promise(r => setTimeout(r, 300));
        
        // Check matches (Simplified logic for brevity but functional)
        const matches = new Set<string>();
        // Hrz
        for(let i=0; i<ROWS; i++) {
            for(let j=0; j<COLS-2; j++) {
                if(temp[i][j] === temp[i][j+1] && temp[i][j] === temp[i][j+2]) {
                    matches.add(`${i},${j}`); matches.add(`${i},${j+1}`); matches.add(`${i},${j+2}`);
                }
            }
        }
        // Vert
        for(let j=0; j<COLS; j++) {
            for(let i=0; i<ROWS-2; i++) {
                if(temp[i][j] === temp[i+1][j] && temp[i][j] === temp[i+2][j]) {
                    matches.add(`${i},${j}`); matches.add(`${i+1},${j}`); matches.add(`${i+2},${j}`);
                }
            }
        }

        if (matches.size > 0) {
            setMovesLeft(m => m - 1);
            playSound('merge');
            setMatchedCells(Array.from(matches));
            await new Promise(r => setTimeout(r, 400));
            
            // Clear & Drop
            matches.forEach(key => {
                const [rr, cc] = key.split(',').map(Number);
                temp[rr][cc] = -1; // Empty
            });
            
            setScore(s => s + (matches.size * 100));
            setMatchedCells([]);

            // Gravity
            for(let j=0; j<COLS; j++) {
                let empty = 0;
                for(let i=ROWS-1; i>=0; i--) {
                    if(temp[i][j] === -1) empty++;
                    else if(empty > 0) {
                        temp[i+empty][j] = temp[i][j];
                        temp[i][j] = -1;
                    }
                }
                for(let i=0; i<empty; i++) temp[i][j] = Math.floor(Math.random() * GEM_TYPES.length);
            }
            setBoard(temp);
        } else {
            // Revert
            const revert = JSON.parse(JSON.stringify(board));
            setBoard(revert);
            playSound('error');
        }
        setIsProcessing(false);
    } else {
        setSelected({r, c});
    }
  };

  useEffect(() => {
      if (!startScreen && (movesLeft === 0 || score >= targetScore)) {
          setTimeout(() => {
              onComplete(score >= targetScore, score);
          }, 1000);
      }
  }, [movesLeft, score, startScreen]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center touch-none">
        
        {/* Game Container */}
        <div className="w-full h-full max-w-md flex flex-col relative bg-[url('https://www.transparenttextures.com/patterns/dark-stone.png')] bg-slate-800">
            
            {/* Header */}
            <div className="h-20 bg-slate-900 border-b-4 border-amber-600 flex items-center justify-between px-4 shadow-2xl z-20">
                <div className="flex flex-col">
                    <span className="text-amber-500 font-bold text-xs uppercase tracking-widest">Target</span>
                    <span className="text-2xl font-black text-white font-[Cinzel]">{targetScore}</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Moves</span>
                    <span className={`text-3xl font-black ${movesLeft < 5 ? 'text-red-500 animate-pulse' : 'text-white'}`}>{movesLeft}</span>
                </div>

                <button onClick={onExit} className="bg-red-900/50 p-2 rounded border border-red-500 text-red-300">
                    <X size={24} />
                </button>
            </div>

            {/* Grid Area */}
            <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                {/* Score Bar */}
                <div className="absolute top-2 left-4 right-4 h-4 bg-slate-900 rounded-full border border-slate-700 overflow-hidden">
                    <div className="h-full bg-amber-500 transition-all duration-500" style={{width: `${Math.min(100, (score/targetScore)*100)}%`}}></div>
                </div>

                {startScreen ? (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                         <h2 className="text-4xl text-white font-[Cinzel] mb-2 text-center">Battle<br/>Ready?</h2>
                         <p className="text-slate-300 mb-6">Match runes to gather power!</p>
                         <button onClick={() => setStartScreen(false)} className="btn-game gold px-8 py-4 text-xl font-bold shadow-xl animate-pulse">
                            START BATTLE
                         </button>
                    </div>
                ) : (
                    <div 
                        className="grid gap-1 p-2 bg-slate-900/50 rounded-xl border-4 border-slate-700"
                        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, width: '100%', aspectRatio: `${COLS}/${ROWS}` }}
                    >
                        {board.map((row, r) => row.map((type, c) => (
                            <div 
                                key={`${r}-${c}`}
                                onClick={() => handleInteraction(r, c)}
                                className={`
                                    relative rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200
                                    ${GEM_TYPES[type].color} border-b-4 ${GEM_TYPES[type].border}
                                    ${selected?.r === r && selected?.c === c ? 'scale-95 brightness-150 ring-2 ring-white' : 'active:scale-90'}
                                    ${matchedCells.includes(`${r},${c}`) ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
                                `}
                            >
                                {GEM_TYPES[type].icon}
                            </div>
                        )))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="h-16 bg-slate-900 border-t border-slate-700 flex items-center justify-center text-slate-500 text-sm font-bold">
                 MATCH 3 ITEMS TO ATTACK
            </div>
        </div>
    </div>
  );
};
