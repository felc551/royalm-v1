
import React, { useState } from 'react';
import { GridSlot, GameItem, ItemType } from '../types';
import { ITEM_DEFINITIONS, MAX_ITEM_LEVEL } from '../constants';
import { Crown, Info } from 'lucide-react';
import { playSound } from '../utils/audio';
import { ItemVisual } from './ItemVisual';

interface MergeGridProps {
  grid: GridSlot[];
  onMerge: (fromIndex: number, toIndex: number) => void;
  onSell: (index: number) => void;
  onItemAck: (itemId: string) => void;
}

export const MergeGrid: React.FC<MergeGridProps> = ({ grid, onMerge, onSell, onItemAck }) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    // Set a ghost image if needed, or browser default
    e.dataTransfer.effectAllowed = "move";
    playSound('pop');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    if (draggedIndex === toIndex) return;

    onMerge(draggedIndex, toIndex);
    setDraggedIndex(null);
  };

  const handleTouchStart = (index: number) => {
    playSound('pop');
    
    // Deselect if clicking the same slot
    if (selectedSlot === index) {
        setSelectedSlot(null);
        return;
    }

    // If no slot selected, select this one if it has an item
    if (selectedSlot === null) {
      if (grid[index].item) {
        setSelectedSlot(index);
      }
      return;
    } 
    
    // If we have a selection and click another slot, attempt move/merge
    onMerge(selectedSlot, index);
    setSelectedSlot(null);
  };

  const getSellValue = (type: ItemType, level: number) => {
    return Math.floor(ITEM_DEFINITIONS[type].baseValue * Math.pow(2, level - 1));
  };

  const getRarityClasses = (level: number) => {
    if (level >= 8) return 'border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)]';
    if (level >= 5) return 'border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]';
    if (level >= 3) return 'border-blue-400 shadow-[0_0_5px_rgba(96,165,250,0.3)]';
    return 'border-slate-600/50';
  };

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Grid Container */}
      <div className="relative bg-slate-900/80 p-3 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-sm">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 rounded-2xl grid-bg pointer-events-none"></div>

        <div className="grid grid-cols-6 gap-2 relative z-10">
          {grid.map((slot, i) => (
            <div
              key={i}
              className={`
                aspect-square relative rounded-xl transition-all duration-200
                ${selectedSlot === i 
                  ? 'bg-indigo-500/30 ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900 z-20' 
                  : 'bg-slate-800/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]'}
                ${draggedIndex === i ? 'opacity-30' : 'opacity-100'}
                ${!grid[i].item ? 'hover:bg-slate-800/70' : ''}
              `}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              onClick={() => handleTouchStart(i)}
            >
              {slot.item && (
                <div
                  key={slot.item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onAnimationEnd={() => {
                    if (slot.item?.isNew) {
                      onItemAck(slot.item.id);
                    }
                  }}
                  className={`
                    w-full h-full p-1 cursor-grab active:cursor-grabbing rounded-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all duration-100
                    bg-slate-800 relative overflow-visible group
                    ${getRarityClasses(slot.item.level)}
                    ${slot.item.isNew ? (slot.item.effectType === 'merge' ? 'animate-merge' : 'animate-pop-in') : ''}
                  `}
                >
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <ItemVisual type={slot.item.type} level={slot.item.level} />
                  </div>
                  
                  {/* Level Indicator */}
                  <div className="absolute -bottom-1 -right-1 bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-slate-600 z-10 shadow-sm">
                    Lv{slot.item.level}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Selected Item Info Panel */}
      <div className="flex-none min-h-[120px]">
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-4 border border-slate-700/50 shadow-xl relative overflow-hidden">
            {selectedSlot !== null && grid[selectedSlot].item ? (
                <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 bg-slate-800 rounded-xl border-2 flex items-center justify-center shadow-lg ${getRarityClasses(grid[selectedSlot].item!.level)}`}>
                            <div className="w-full h-full p-1">
                                <ItemVisual type={grid[selectedSlot].item!.type} level={grid[selectedSlot].item!.level} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white font-black text-lg leading-none mb-1">
                                {ITEM_DEFINITIONS[grid[selectedSlot].item!.type].name}
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide border
                                    ${grid[selectedSlot].item!.level >= 8 ? 'bg-fuchsia-900/50 text-fuchsia-300 border-fuchsia-700' : 
                                    grid[selectedSlot].item!.level >= 5 ? 'bg-amber-900/50 text-amber-300 border-amber-700' : 
                                    'bg-indigo-900/50 text-indigo-300 border-indigo-700'}
                                `}>
                                    Level {grid[selectedSlot].item!.level}
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">
                                    Value: <span className="text-amber-400">{getSellValue(grid[selectedSlot].item!.type, grid[selectedSlot].item!.level)}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => {
                            playSound('coin');
                            onSell(selectedSlot);
                            setSelectedSlot(null);
                        }}
                        className="btn-3d bg-gradient-to-b from-red-600 to-red-800 text-white px-6 py-3 rounded-xl font-black text-sm shadow-lg border-b-red-950 hover:from-red-500 hover:to-red-700"
                    >
                        SELL
                    </button>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500 gap-2 opacity-60">
                    <Info className="w-5 h-5" />
                    <span className="text-sm font-bold uppercase tracking-wider">Select an item to view details</span>
                </div>
            )}
            
            {/* Decorative background Elements */}
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};
