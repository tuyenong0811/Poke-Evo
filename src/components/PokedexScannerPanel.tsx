import React, { useState, useEffect } from 'react';
import { PokemonEvolutionEntry } from '../types/pokemon';
import {
  formatDexId,
  formatTypesViList,
  STAGE_LABELS,
  GENERATION_NAMES
} from '../utils/pokemonLogic';
import {
  Shuffle,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PokedexScannerPanelProps {
  activePokemon: PokemonEvolutionEntry;
  allPokemon: PokemonEvolutionEntry[];
  onSelectPokemon: (pokemon: PokemonEvolutionEntry) => void;
  onOpenModal: (pokemon: PokemonEvolutionEntry) => void;
  onRandomPokemon: () => void;
}

export const PokedexScannerPanel: React.FC<PokedexScannerPanelProps> = ({
  activePokemon,
  allPokemon,
  onSelectPokemon,
  onOpenModal,
  onRandomPokemon
}) => {
  const [imgError, setImgError] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [activePokemon.id]);

  const stageInfo = STAGE_LABELS[activePokemon.stage] || STAGE_LABELS.base;
  const genInfo = GENERATION_NAMES[activePokemon.generation] || {
    nameVi: `Thế hệ ${activePokemon.generation}`,
    region: '',
    years: ''
  };

  const sortedChain = [...(activePokemon.chainMembers || [])].sort(
    (a, b) => a.depth - b.depth || a.id - b.id
  );

  const handleStepPokemon = (delta: number) => {
    const nextId = Math.max(1, Math.min(1025, activePokemon.id + delta));
    const found = allPokemon.find(p => p.id === nextId);
    if (found) {
      onSelectPokemon(found);
    }
  };

  const handleJumpChain = (position: 'first' | 'last') => {
    if (sortedChain.length === 0) return;
    const targetSummary =
      position === 'first' ? sortedChain[0] : sortedChain[sortedChain.length - 1];
    const found = allPokemon.find(p => p.id === targetSummary.id);
    if (found) {
      onSelectPokemon(found);
    }
  };

  return (
    <aside
      aria-label="Màn hình Rotom Phone chính"
      className="bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#B91C1C] rounded-2xl sm:rounded-[2.25rem] p-2.5 sm:p-3.5 border-2 border-[#7F1D1D] shadow-2xl flex flex-col gap-2"
    >
      {/* Top Rotom Phone Earpiece Notch & Cyan Eyes */}
      <div className="flex items-center justify-between px-3 sm:px-4 pt-0.5 pb-0.5" aria-hidden="true">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-cyan-300 border border-slate-900" />
          <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-cyan-300 border border-slate-900" />
        </div>
        <div className="w-14 sm:w-16 h-1.5 rounded-full bg-slate-950/70" />
        <span className="text-[10px] font-mono font-extrabold text-white tracking-wider">
          MÁY QUÉT ROTOM
        </span>
      </div>

      {/* Edge-to-Edge Smart Glass Display */}
      <div className="bg-[#090D16] text-slate-100 rounded-xl sm:rounded-[1.75rem] p-3 sm:p-4 border-2 border-red-400/50 shadow-inner space-y-3">
        {/* Smart Status Bar */}
        <div className="flex items-center justify-between gap-2 text-xs border-b border-slate-800/90 pb-2">
          <div className="flex items-center gap-1.5 font-mono tabular-nums font-bold min-w-0 truncate">
            <span className="text-red-400 shrink-0">{formatDexId(activePokemon.id)}</span>
            <span className="text-slate-600 shrink-0" aria-hidden="true">·</span>
            <span className="text-amber-400 truncate">
              Thế hệ {activePokemon.generation} <span className="hidden sm:inline">({genInfo.region})</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => onOpenModal(activePokemon)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-600/20 border border-red-500/40 text-[11px] font-semibold text-red-300 hover:text-white transition-colors whitespace-nowrap shrink-0"
              aria-label={`Chi tiết tiến hóa của ${activePokemon.name}`}
            >
              <Maximize2 className="w-3 h-3" />
              <span>Chi tiết</span>
            </button>

            {/* Mobile Expand/Collapse Toggle (< lg) */}
            <button
              type="button"
              onClick={() => setMobileExpanded(prev => !prev)}
              className="lg:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] font-semibold text-slate-200 hover:text-white whitespace-nowrap shrink-0"
              aria-label={mobileExpanded ? 'Thu gọn máy quét' : 'Mở rộng máy quét'}
            >
              <span>{mobileExpanded ? 'Thu gọn' : 'Mở rộng'}</span>
              {mobileExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Center Pokémon Spotlight */}
        <div className="flex flex-row lg:flex-col xl:flex-row items-center gap-3 sm:gap-4 py-0.5">
          <div
            onClick={() => onOpenModal(activePokemon)}
            className="cursor-pointer relative w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 shrink-0 rounded-2xl bg-gradient-to-b from-red-950/40 to-slate-900 border border-red-500/30 flex items-center justify-center group"
            title="Bấm để phóng to sơ đồ"
          >
            <img
              src={imgError ? activePokemon.thumb : activePokemon.sprite}
              alt={activePokemon.name}
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
              className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-contain group-hover:scale-105 transition-transform duration-150"
            />
          </div>

          <div className="flex-1 text-left lg:text-center xl:text-left min-w-0 space-y-1">
            <h2 className="text-lg sm:text-2xl font-extrabold text-white tracking-tight truncate">
              {activePokemon.name}
            </h2>

            {/* Unboxed Metadata: Types & Stage */}
            <div className="flex flex-wrap items-center lg:justify-center xl:justify-start gap-x-2 gap-y-0.5 text-xs font-medium">
              <span className="font-mono font-bold text-red-400">
                Hệ: {formatTypesViList(activePokemon.types, ' / ')}
              </span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-amber-300 font-semibold">
                {stageInfo.vi}
              </span>
            </div>

            {/* Direct Evolution Origin */}
            <div className="pt-0.5 text-xs">
              {activePokemon.evolvesFrom ? (
                <p className="text-slate-300 leading-snug line-clamp-2">
                  <span className="text-slate-400">Từ cấp trước: </span>
                  <span className="font-semibold text-amber-300">
                    {activePokemon.evolvesFrom.conditionVi}
                  </span>
                </p>
              ) : activePokemon.stage === 'single' ? (
                <p className="text-slate-400 italic">
                  Dạng độc lập · Không tiến hóa
                </p>
              ) : (
                <p className="text-red-300 font-medium">
                  Dạng khởi đầu của chuỗi tiến hóa
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Collapsible Details on Mobile (Always visible on Desktop lg+) */}
        <div className={`${mobileExpanded ? 'block' : 'hidden'} lg:block space-y-3`}>
          {/* Interactive Family Chain Strip */}
          <div className="pt-2.5 border-t border-slate-800/90 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold uppercase tracking-wider text-red-400">
                Chuỗi gia phả tiến hóa ({sortedChain.length})
              </span>
              <span className="font-mono tabular-nums text-slate-500">
                Gia tộc #{activePokemon.chainId}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {sortedChain.map((member, idx) => {
                const isSelected = member.id === activePokemon.id;
                const fullMember = allPokemon.find(p => p.id === member.id);
                return (
                  <React.Fragment key={member.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (fullMember) {
                          onSelectPokemon(fullMember);
                        }
                      }}
                      className={`flex flex-col items-center p-1.5 rounded-xl border text-center min-w-[72px] shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-red-950/70 border-red-400 text-white'
                          : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-red-500/50'
                      }`}
                    >
                      <span className="text-[9px] font-mono tabular-nums text-red-400">
                        {formatDexId(member.id)}
                      </span>
                      <img
                        src={member.sprite}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        className="w-10 h-10 object-contain my-0.5"
                      />
                      <span className="text-[10px] font-bold truncate max-w-[66px]">
                        {member.name}
                      </span>
                    </button>
                    {idx < sortedChain.length - 1 && (
                      <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Rotom Smart Evolution Condition Card */}
          <div className="bg-slate-900/90 border border-red-500/30 rounded-2xl p-3 text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-red-400 border-b border-slate-800 pb-1">
              <span>ĐIỀU KIỆN TIẾN HÓA TIẾP THEO</span>
              <span className="tabular-nums">{formatDexId(activePokemon.id)}</span>
            </div>

            {activePokemon.evolvesTo.length > 0 ? (
              <div className="space-y-1 pt-0.5 max-h-28 overflow-y-auto scrollbar-thin">
                {activePokemon.evolvesTo.map((target, idx) => {
                  const targetEntry = allPokemon.find(p => p.id === target.targetId);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (targetEntry) {
                          onSelectPokemon(targetEntry);
                        }
                      }}
                      className="w-full text-left hover:bg-slate-800 p-1.5 rounded-lg transition-colors flex items-center justify-between gap-2"
                    >
                      <span className="font-bold text-white flex items-center gap-1 whitespace-nowrap shrink-0">
                        <ArrowRight className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <span>{target.targetName}</span>
                      </span>
                      <span className="text-[11px] text-amber-300 font-semibold text-right truncate">
                        {target.conditionVi}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : activePokemon.stage === 'single' ? (
              <p className="py-1 text-slate-400">
                Không có nhánh tiến hóa nào được ghi nhận.
              </p>
            ) : (
              <p className="py-1 text-emerald-400 font-semibold">
                {`Đã đạt cấp tiến hóa tối đa (${activePokemon.name}).`}
              </p>
            )}
          </div>
        </div>

        {/* Rotom Phone Touch Controls */}
        <div className="pt-1 space-y-2">
          {/* Quick Step & Chain Navigation Row */}
          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => handleJumpChain('first')}
              title="Về đầu chuỗi tiến hóa"
              aria-label="Về đầu chuỗi tiến hóa"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-bold transition-colors whitespace-nowrap"
            >
              <ChevronsLeft className="w-3.5 h-3.5 text-red-400" />
              <span>Đầu</span>
            </button>

            <button
              type="button"
              onClick={() => handleStepPokemon(-1)}
              title="Pokémon trước đó"
              aria-label="Pokémon trước đó"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-bold transition-colors whitespace-nowrap"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Trước</span>
            </button>

            <button
              type="button"
              onClick={() => handleStepPokemon(1)}
              title="Pokémon tiếp theo"
              aria-label="Pokémon tiếp theo"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-bold transition-colors whitespace-nowrap"
            >
              <span>Tiếp</span>
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <button
              type="button"
              onClick={() => handleJumpChain('last')}
              title="Đến cuối chuỗi tiến hóa"
              aria-label="Đến cuối chuỗi tiến hóa"
              className="flex items-center justify-center gap-1 py-2 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-bold transition-colors whitespace-nowrap"
            >
              <span>Cuối</span>
              <ChevronsRight className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>

          {/* Primary Smart Actions Row */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onRandomPokemon}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs transition-colors whitespace-nowrap shrink-0 shadow-sm"
              aria-label="Chọn ngẫu nhiên Pokémon"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Ngẫu nhiên</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenModal(activePokemon)}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Sơ Đồ Đầy Đủ</span>
            </button>
          </div>
        </div>

        {/* Smartphone Home Bar Indicator */}
        <div className="pt-0.5 flex justify-center" aria-hidden="true">
          <div className="w-20 sm:w-24 h-1 rounded-full bg-red-500/40" />
        </div>
      </div>
    </aside>
  );
};
