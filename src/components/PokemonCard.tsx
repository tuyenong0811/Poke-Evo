import React, { useState } from 'react';
import { PokemonEvolutionEntry } from '../types/pokemon';
import { formatDexId, formatTypesViList, STAGE_LABELS } from '../utils/pokemonLogic';
import { ArrowRight, ChevronRight, GitBranch } from 'lucide-react';

interface PokemonCardProps {
  pokemon: PokemonEvolutionEntry;
  isActive?: boolean;
  onSelect: (pokemon: PokemonEvolutionEntry) => void;
  onScan?: (pokemon: PokemonEvolutionEntry) => void;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  isActive = false,
  onSelect,
  onScan
}) => {
  const [imgError, setImgError] = useState(false);
  const stageInfo = STAGE_LABELS[pokemon.stage] || STAGE_LABELS.base;

  return (
    <div
      onClick={() => onSelect(pokemon)}
      onMouseEnter={() => {
        if (onScan) onScan(pokemon);
      }}
      className={`group cursor-pointer rounded-2xl border transition-all duration-150 overflow-hidden flex flex-col justify-between ${
        isActive
          ? 'bg-slate-900 border-red-500 ring-1 ring-red-500/50 shadow-md'
          : 'bg-slate-900/95 border-slate-800 hover:border-red-400/80 shadow-xs'
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(pokemon);
        }
      }}
      aria-label={`Chi tiết tiến hóa của ${pokemon.name}`}
    >
      {/* Top 1-Line Kicker (Zero-Pill Unboxed Metadata) */}
      <div className="px-2.5 sm:px-3.5 pt-2.5 sm:pt-3 flex items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-400">
        <span className="font-mono font-bold tabular-nums text-red-400 shrink-0">
          {formatDexId(pokemon.id)}
        </span>
        <span className="truncate font-medium text-slate-300 text-right">
          {stageInfo.vi.split(' (')[0]}
        </span>
      </div>

      {/* Center: Official Artwork Illustration & Identity */}
      <div className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 flex flex-col items-center">
        <div className="relative w-18 h-18 sm:w-24 sm:h-24 my-0.5 sm:my-1 flex items-center justify-center rounded-2xl bg-gradient-to-b from-red-950/30 to-slate-950 border border-slate-800/90 group-hover:border-red-500/40 transition-colors">
          <img
            src={imgError ? pokemon.thumb : pokemon.sprite}
            alt={pokemon.name}
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-15 h-15 sm:w-20 sm:h-20 object-contain group-hover:scale-105 transition-transform duration-150"
          />
        </div>

        <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-red-300 transition-colors text-center truncate w-full mt-1">
          {pokemon.name}
        </h3>

        {/* Unboxed Type Metadata */}
        <div className="flex items-center justify-center gap-1 mt-0.5 text-[9px] sm:text-[10px] font-mono tracking-wider text-amber-400 font-semibold truncate max-w-full">
          <span className="truncate">{formatTypesViList(pokemon.types, ' · ')}</span>
          <span className="text-slate-600 shrink-0" aria-hidden="true">·</span>
          <span className="text-slate-400 shrink-0">TH{pokemon.generation}</span>
        </div>
      </div>

      {/* Evolution Readout Section */}
      <div className="mt-1 bg-slate-950/90 p-2 sm:p-3 border-t border-slate-800/90 text-[11px] sm:text-xs">
        {pokemon.stage === 'single' ? (
          <div className="text-center text-slate-400 py-0.5 sm:py-1">
            <span className="text-[10px] sm:text-[11px] block text-slate-500">
              Dạng độc lập
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-slate-300">
              Không tiến hóa
            </span>
          </div>
        ) : (
          <div className="space-y-1 sm:space-y-1.5">
            {pokemon.evolvesFrom && (
              <div className="flex items-start gap-1 text-[10px] sm:text-[11px]">
                <span className="text-slate-500 shrink-0 font-medium">
                  Từ:
                </span>
                <span className="font-semibold text-amber-300 truncate">
                  {pokemon.evolvesFrom.conditionVi}
                </span>
              </div>
            )}

            {pokemon.evolvesTo.length > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400">
                  <span className="truncate">Tiến hóa:</span>
                  {pokemon.evolvesTo.length > 1 && (
                    <span className="text-[9px] sm:text-[10px] font-mono text-red-400 font-bold tabular-nums shrink-0">
                      {pokemon.evolvesTo.length} nhánh
                    </span>
                  )}
                </div>

                {pokemon.evolvesTo.slice(0, 2).map((target, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-slate-900 px-1.5 sm:px-2 py-1 rounded-lg border border-slate-800 gap-1"
                  >
                    <div className="flex items-center gap-1 min-w-0">
                      <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400 shrink-0" />
                      <span className="font-bold text-slate-100 text-[10px] sm:text-[11px] truncate">
                        {target.targetName}
                      </span>
                    </div>
                    <span className="text-[9px] sm:text-[10px] text-amber-300 font-medium text-right shrink-0 max-w-[70px] sm:max-w-[110px] truncate">
                      {target.conditionVi}
                    </span>
                  </div>
                ))}

                {pokemon.evolvesTo.length > 2 && (
                  <div className="text-[9px] sm:text-[10px] text-center text-slate-400 pt-0.5 font-mono">
                    {`+${pokemon.evolvesTo.length - 2} nhánh khác`}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-emerald-400 font-semibold text-[10px] sm:text-[11px] py-0.5 sm:py-1">
                Dạng tiến hóa tối đa
              </div>
            )}
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] sm:text-[11px] font-semibold text-red-400 group-hover:text-red-300 transition-colors">
          <span className="flex items-center gap-1 truncate">
            <GitBranch className="w-3 h-3 shrink-0" />
            <span className="truncate">Cây gia phả</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
