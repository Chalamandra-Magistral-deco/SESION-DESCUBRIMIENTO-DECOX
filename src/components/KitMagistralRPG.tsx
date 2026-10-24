import { useState } from 'react';
import { Shield, BookOpen, Eye, Flame, Crown, Lock, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { RPG_ITEMS } from '../utils/constants';
import { RPGItem } from '../types';
import { useAudio } from '../hooks/useAudio';
import { triggerConfetti } from './Confetti';

interface KitMagistralRPGProps {
  userLevel: number;
  userXp: number;
  unlockedItemIds: string[];
  onUnlockItem: (itemId: string) => void;
  archetypeId: string | null;
}

export default function KitMagistralRPG({
  userLevel,
  userXp,
  unlockedItemIds,
  onUnlockItem,
  archetypeId
}: KitMagistralRPGProps) {
  const [selectedItem, setSelectedItem] = useState<RPGItem | null>(RPG_ITEMS[0]);
  const { playSuccessChime, playTick } = useAudio();

  const xpNextLevel = userLevel * 100;
  const xpCurrentLevel = userXp % 100;
  const xpPercentage = Math.min(100, Math.round((xpCurrentLevel / 100) * 100));

  const getItemIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'Eye': return <Eye className="w-5 h-5 text-cyan-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-yellow-400" />;
      default: return <Shield className="w-5 h-5 text-purple-400" />;
    }
  };

  const handleUnlock = (item: RPGItem) => {
    if (userLevel >= item.requiredLevel && !unlockedItemIds.includes(item.id)) {
      onUnlockItem(item.id);
      playSuccessChime();
      triggerConfetti();
    } else {
      playTick(400, 'sine', 0.1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>Sistema de Progresión RPG Táctico</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          Kit Magistral & Artefactos
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
          Completa rituales, responde consultas y ejecuta hacks para elevar tu Nivel de Dominio y desbloquear equipamiento de alto impacto.
        </p>
      </div>

      {/* Character Profile Card */}
      <div className="p-8 rounded-3xl bg-slate-900/90 border border-amber-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 p-0.5 shadow-xl flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400">
                <Crown className="w-8 h-8" />
              </div>
            </div>

            <div>
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block">
                {archetypeId ? `Arquetipo: ${archetypeId}` : 'Arquitecto de Dominio'}
              </span>
              <h2 className="text-2xl font-extrabold text-slate-100">
                Nivel {userLevel} - Rango Magistral
              </h2>
              <span className="text-xs text-slate-400">Puntos de Experiencia Totales: {userXp} XP</span>
            </div>
          </div>

          {/* XP Progress */}
          <div className="w-full sm:w-64 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Progreso a Nivel {userLevel + 1}</span>
              <span className="text-amber-400 font-bold">{xpCurrentLevel} / 100 XP</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Inventory Grid & Item Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Inventory List */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Inventario de Artefactos</h3>
            <span className="text-xs font-mono text-slate-400">
              {unlockedItemIds.length} / {RPG_ITEMS.length} Desbloqueados
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RPG_ITEMS.map((item) => {
              const isUnlocked = unlockedItemIds.includes(item.id) || userLevel >= item.requiredLevel;
              const isSelected = selectedItem?.id === item.id;

              return (
                <div
                  key={item.id}
                  id={`rpg-item-${item.id}`}
                  onClick={() => setSelectedItem(item)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                      : isUnlocked
                      ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        {getItemIcon(item.iconName)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                        <span className="text-[10px] font-mono text-amber-400/80">{item.rarity}</span>
                      </div>
                    </div>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Item Inspector */}
        {selectedItem && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  {getItemIcon(selectedItem.iconName)}
                </div>
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest">{selectedItem.type}</span>
                  <h3 className="text-base font-bold text-slate-100">{selectedItem.name}</h3>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                {selectedItem.description}
              </p>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                <span className="text-[10px] font-mono text-emerald-400 block font-bold">Efecto Táctico:</span>
                <span className="text-xs font-bold text-slate-100">{selectedItem.effect}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex justify-between text-xs font-mono text-slate-400">
                <span>Nivel Requerido:</span>
                <span className={userLevel >= selectedItem.requiredLevel ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  Nivel {selectedItem.requiredLevel}
                </span>
              </div>

              {unlockedItemIds.includes(selectedItem.id) ? (
                <div className="w-full py-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold text-center">
                  Artefacto Equipado
                </div>
              ) : (
                <button
                  id="rpg-unlock-btn"
                  disabled={userLevel < selectedItem.requiredLevel}
                  onClick={() => handleUnlock(selectedItem)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 text-xs font-bold shadow-md shadow-amber-950/40 disabled:opacity-40 cursor-pointer transition-all"
                >
                  Desbloquear Artefacto
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
