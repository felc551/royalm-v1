
import React, { useState, useEffect } from 'react';
import { GameTab, GridSlot, PlayerState, GameItem, ItemType, Parcel } from './types';
import { GRID_SIZE, INITIAL_PARCELS, MAX_ITEM_LEVEL, ITEM_DEFINITIONS } from './constants';
import { MergeGrid } from './components/MergeGrid';
import { KingdomMap } from './components/KingdomMap';
import { AdventureMap } from './components/AdventureMap';
import { StartScreen } from './components/StartScreen';
import { LevelUpModal } from './components/LevelUpModal';
import { ShopModal } from './components/ShopModal';
import { SettingsModal } from './components/SettingsModal';
import { TutorialOverlay } from './components/TutorialOverlay';
import { Match3Board } from './components/Match3Board';
import { Zap, Gem, Coins, Map, Grid as GridIcon, Sword, Settings, Plus, ShoppingCart } from 'lucide-react';
import { playSound } from './utils/audio';

const App: React.FC = () => {
  // --- State ---
  const [gameState, setGameState] = useState<'START' | 'PLAYING'>('START');
  const [activeTab, setActiveTab] = useState<GameTab>('merge');
  
  // Modals State
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // Match 3 State
  const [activeMission, setActiveMission] = useState<any | null>(null);
  
  const [player, setPlayer] = useState<PlayerState>({
    gold: 100,
    gems: 25,
    energy: 30,
    maxEnergy: 50,
    xp: 0,
    level: 1
  });

  const [grid, setGrid] = useState<GridSlot[]>(() => 
    Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => ({ index: i, item: null }))
  );

  const [parcels, setParcels] = useState<Parcel[]>(INITIAL_PARCELS);

  // --- XP & Level Up Check ---
  useEffect(() => {
    const xpThreshold = player.level * 50;
    if (player.xp >= xpThreshold) {
       setPlayer(prev => ({
         ...prev,
         level: prev.level + 1,
         xp: prev.xp - xpThreshold,
         energy: prev.maxEnergy + 5, 
         maxEnergy: prev.maxEnergy + 5,
         gems: prev.gems + 5
       }));
       setShowLevelUp(true);
       playSound('success');
    }
  }, [player.xp, player.level]);

  // --- Energy Regeneration ---
  useEffect(() => {
    const timer = setInterval(() => {
      setPlayer(prev => ({
        ...prev,
        energy: Math.min(prev.energy + 1, prev.maxEnergy)
      }));
    }, 30000); 
    return () => clearInterval(timer);
  }, []);

  const spawnItem = (type: ItemType, level: number) => {
    const emptySlotIndex = grid.findIndex(s => s.item === null);
    if (emptySlotIndex === -1) return false;

    const newItem: GameItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      level,
      isNew: true,
      effectType: 'spawn'
    };

    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[emptySlotIndex].item = newItem;
      return newGrid;
    });
    playSound('pop');
    return true;
  };

  const handleMerge = (fromIndex: number, toIndex: number) => {
    const fromSlot = grid[fromIndex];
    const toSlot = grid[toIndex];

    if (!fromSlot.item) return;

    setGrid(prev => {
      const newGrid = [...prev];

      // Case 1: Move
      if (!toSlot.item) {
        newGrid[toIndex].item = fromSlot.item;
        newGrid[fromIndex].item = null;
        return newGrid;
      }

      // Case 2: Merge
      if (toSlot.item && 
          toSlot.item.type === fromSlot.item.type && 
          toSlot.item.level === fromSlot.item.level &&
          toSlot.item.level < MAX_ITEM_LEVEL
      ) {
        const newItem: GameItem = {
          ...toSlot.item,
          id: Math.random().toString(36).substr(2, 9),
          level: toSlot.item.level + 1,
          isNew: true,
          effectType: 'merge'
        };
        
        newGrid[toIndex].item = newItem;
        newGrid[fromIndex].item = null;
        setPlayer(p => ({ ...p, xp: p.xp + (newItem.level * 2) }));
        playSound('merge');
        return newGrid;
      }

      // Case 3: Swap
      const temp = newGrid[toIndex].item;
      newGrid[toIndex].item = newGrid[fromIndex].item;
      newGrid[fromIndex].item = temp;
      playSound('pop');
      return newGrid;
    });
  };

  const handleSell = (index: number) => {
    const item = grid[index].item;
    if (!item) return;

    const value = Math.floor(ITEM_DEFINITIONS[item.type].baseValue * Math.pow(2, item.level - 1));
    
    setPlayer(prev => ({ ...prev, gold: prev.gold + value }));
    setGrid(prev => {
      const newGrid = [...prev];
      newGrid[index].item = null;
      return newGrid;
    });
  };

  const handleRestoreParcel = (parcelId: string) => {
    const parcel = parcels.find(p => p.id === parcelId);
    if (!parcel) return;
    
    let itemsFound = true;
    const itemsToConsume: number[] = [];
    const tempGrid = [...grid]; 

    for (const req of parcel.costItems) {
       const slotIndex = tempGrid.findIndex(s => s.item && s.item.type === req.type && s.item.level >= req.level && !itemsToConsume.includes(s.index));
       if (slotIndex === -1) {
         itemsFound = false;
         break;
       }
       itemsToConsume.push(slotIndex);
    }

    if (player.gold >= parcel.costGold && itemsFound) {
      setPlayer(prev => ({ ...prev, gold: prev.gold - parcel.costGold, xp: prev.xp + 50 }));
      setGrid(prev => {
        const next = [...prev];
        itemsToConsume.forEach(idx => {
          next[idx].item = null;
        });
        return next;
      });
      setParcels(prev => prev.map(p => p.id === parcelId ? { ...p, isUnlocked: true } : p));
      playSound('magic');
    } else {
      playSound('error');
      alert("Not enough resources!");
    }
  };

  // Match 3 Logic
  const handleStartMission = (mission: any) => {
      if (player.energy >= mission.cost) {
          setPlayer(p => ({...p, energy: p.energy - mission.cost}));
          setActiveMission(mission);
      } else {
          setShowShop(true);
      }
  };

  const handleMatch3Complete = (success: boolean, score: number) => {
      if (success && activeMission) {
          const level = Math.floor(Math.random() * 2) + 1;
          spawnItem(activeMission.rewardType, level);
          playSound('success');
      }
      setActiveMission(null);
  };

  const handleItemAck = (itemId: string) => {
    setGrid(prev => prev.map(slot => {
      if (slot.item && slot.item.id === itemId && slot.item.isNew) {
        return { ...slot, item: { ...slot.item, isNew: false } };
      }
      return slot;
    }));
  };

  const startGame = () => {
      playSound('magic');
      setGameState('PLAYING');
      setTimeout(() => setShowTutorial(true), 1000);
  };

  if (gameState === 'START') {
      return <StartScreen onStart={startGame} />;
  }

  return (
    <div className="app-container">
      <div className="app-overlay"></div>

      {/* FULLSCREEN OVERLAYS (Z-Index 50+) */}
      {activeMission && (
          <Match3Board 
             moves={activeMission.moves}
             targetScore={activeMission.targetScore}
             difficulty={activeMission.difficulty}
             onComplete={handleMatch3Complete}
             onExit={() => setActiveMission(null)}
          />
      )}
      
      {/* Modals */}
      {showLevelUp && <LevelUpModal level={player.level} onClose={() => setShowLevelUp(false)} />}
      {showShop && <ShopModal gems={player.gems} onClose={() => setShowShop(false)} onBuyEnergy={() => {setPlayer(p=>({...p, energy: p.maxEnergy, gems: p.gems-5})); setShowShop(false)}} onBuyGold={() => {setPlayer(p=>({...p, gold: p.gold+500, gems: p.gems-10})); setShowShop(false)}} onBuyChest={() => {setPlayer(p=>({...p, gems: p.gems-15})); setShowShop(false); spawnItem(ItemType.WOOD, 4);}} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

      {/* --- Header (Resource Bar) --- */}
      <div className="relative z-10 p-2">
        <div className="gold-frame bg-slate-900/90 flex items-center justify-between p-2 px-3">
             {/* Profile / Level */}
             <div className="flex items-center gap-2">
                 <div className="w-10 h-10 bg-blue-600 rounded-lg border-2 border-blue-400 flex items-center justify-center shadow-lg relative">
                    <span className="text-white font-black text-lg">{player.level}</span>
                    <div className="absolute -bottom-2 bg-blue-900 text-[8px] px-1 rounded text-blue-200 border border-blue-500">LVL</div>
                 </div>
                 <div className="flex flex-col w-20">
                    <div className="h-2 bg-slate-800 rounded-full border border-slate-600 overflow-hidden">
                        <div className="h-full bg-blue-400" style={{width: `${(player.xp / (player.level * 50))*100}%`}}></div>
                    </div>
                 </div>
             </div>

             {/* Resources */}
             <div className="flex items-center gap-3">
                 <div className="flex flex-col items-end">
                     <div className="flex items-center gap-1">
                         <span className="text-white font-bold">{player.energy}</span>
                         <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                     </div>
                     <div className="flex items-center gap-1">
                         <span className="text-white font-bold">{player.gold}</span>
                         <Coins className="w-4 h-4 text-amber-400 fill-amber-400" />
                     </div>
                 </div>
                 <button onClick={() => setShowShop(true)} className="bg-green-600 p-2 rounded-lg border-b-4 border-green-800 active:border-b-0 active:translate-y-1">
                     <Plus className="w-5 h-5 text-white" />
                 </button>
             </div>
        </div>
      </div>

      {/* --- Main Scrollable Content --- */}
      <div className="scroll-content">
         <div className="px-3">
            {activeTab === 'merge' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <MergeGrid 
                        grid={grid} 
                        onMerge={handleMerge}
                        onSell={handleSell}
                        onItemAck={handleItemAck}
                    />
                </div>
            )}
            {activeTab === 'kingdom' && (
                <KingdomMap 
                    parcels={parcels} 
                    playerGold={player.gold}
                    inventoryGrid={grid.map(g => g.item)}
                    onRestore={handleRestoreParcel}
                />
            )}
            {activeTab === 'adventure' && (
                <AdventureMap 
                    energy={player.energy}
                    onStartMission={handleStartMission}
                />
            )}
         </div>
      </div>

      {/* --- Bottom Navigation --- */}
      <div className="relative z-20 px-2 pb-4 pt-2">
         <div className="gold-frame bg-slate-800 h-20 flex items-center justify-around px-2 relative shadow-2xl">
            <button onClick={() => {playSound('pop'); setActiveTab('kingdom')}} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'kingdom' ? 'scale-110 text-amber-400' : 'text-slate-400 grayscale'}`}>
                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center border-2 border-slate-600 shadow-lg">
                    <Map className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold uppercase bg-black/50 px-2 rounded">Kingdom</span>
            </button>

            <div className="relative -top-8">
                <button onClick={() => {playSound('pop'); setActiveTab('merge')}} className="w-20 h-20 bg-gradient-to-b from-amber-400 to-orange-500 rounded-2xl rotate-45 border-4 border-white shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex items-center justify-center group transition-transform active:scale-95">
                    <div className="-rotate-45">
                        <GridIcon className="w-10 h-10 text-white drop-shadow-md" strokeWidth={3} />
                    </div>
                </button>
            </div>

            <button onClick={() => {playSound('pop'); setActiveTab('adventure')}} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'adventure' ? 'scale-110 text-red-400' : 'text-slate-400 grayscale'}`}>
                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center border-2 border-slate-600 shadow-lg">
                    <Sword className="w-7 h-7" />
                </div>
                <span className="text-[10px] font-bold uppercase bg-black/50 px-2 rounded">Battle</span>
            </button>
         </div>
      </div>

    </div>
  );
};

export default App;
