
import React from 'react';
import { Play, Gift, MapPin } from 'lucide-react';
import { ItemType } from '../types';

// Missions config
const MISSIONS = [
  { id: 1, name: "Whispering Woods", cost: 2, targetScore: 500, moves: 15, rewardType: ItemType.WOOD, difficulty: 'Easy', bg: 'bg-emerald-900' },
  { id: 2, name: "Granite Quarry", cost: 3, targetScore: 800, moves: 20, rewardType: ItemType.STONE, difficulty: 'Medium', bg: 'bg-stone-800' },
  { id: 3, name: "Golden Fields", cost: 4, targetScore: 1200, moves: 25, rewardType: ItemType.CROP, difficulty: 'Hard', bg: 'bg-yellow-900' },
  { id: 4, name: "Mystic Ruins", cost: 5, targetScore: 2000, moves: 30, rewardType: ItemType.POTION, difficulty: 'Expert', bg: 'bg-purple-900' },
];

interface AdventureMapProps {
  energy: number;
  onStartMission: (mission: any) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({ energy, onStartMission }) => {

  return (
    <div className="space-y-6 h-full px-2 pb-20">
      
      <div className="text-center space-y-1 my-4">
        <h2 className="text-3xl font-bold text-amber-400 drop-shadow-md fantasy-font">Expeditions</h2>
        <p className="text-slate-400 text-sm">Battle monsters to earn resources</p>
      </div>

      <div className="grid gap-5">
        {MISSIONS.map(mission => (
          <div key={mission.id} className="gold-frame overflow-hidden group">
             <div className={`h-24 ${mission.bg} relative flex items-center px-4`}>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative z-10 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">{mission.difficulty}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white fantasy-font">{mission.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                        <Gift className="w-3 h-3" /> Reward: <span className="text-white font-bold">{mission.rewardType}</span>
                    </div>
                </div>
                
                <button
                    onClick={() => onStartMission(mission)}
                    className={`
                        relative z-10 px-4 py-3 rounded-xl font-bold shadow-lg transition-transform active:scale-95 flex flex-col items-center min-w-[80px] border-b-4
                        ${energy >= mission.cost ? 'bg-blue-600 border-blue-800 text-white' : 'bg-slate-600 border-slate-800 text-slate-400 grayscale'}
                    `}
                >
                    <span className="text-xs mb-1">START</span>
                    <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded">
                        <span className="text-yellow-300 font-black">-{mission.cost}</span>
                        <span className="text-[10px]">⚡</span>
                    </div>
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};
