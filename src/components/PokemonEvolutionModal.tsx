import React, { useEffect, useState } from 'react';
import { PokemonEvolutionEntry } from '../types/pokemon';
import {
  formatDexId,
  formatTypesViList,
  STAGE_LABELS,
  TRIGGER_LABELS
} from '../utils/pokemonLogic';
import {
  X,
  ArrowRight,
  GitBranch,
  Copy,
  Check,
  Info
} from 'lucide-react';

interface PokemonEvolutionModalProps {
  pokemon: PokemonEvolutionEntry | null;
  allPokemon: PokemonEvolutionEntry[];
  onClose: () => void;
  onSelectPokemon: (pokemon: PokemonEvolutionEntry) => void;
}

export const PokemonEvolutionModal: React.FC<PokemonEvolutionModalProps> = ({
  pokemon,
  allPokemon,
  onClose,
  onSelectPokemon
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [pokemon?.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!pokemon) return null;

  const stageInfo = STAGE_LABELS[pokemon.stage] || STAGE_LABELS.base;
  const chainMembers = pokemon.chainMembers || [];
  const sortedChain = [...chainMembers].sort((a, b) => a.depth - b.depth || a.id - b.id);

  const handleCopy = () => {
    let text = `${pokemon.name} (${formatDexId(pokemon.id)})\n`;
    text += `Cấp bậc: ${STAGE_LABELS[pokemon.stage]?.vi || pokemon.stage}\n`;
    if (pokemon.evolvesFrom) {
      text += `Tiến hóa từ: #${pokemon.evolvesFrom.fromId} (${pokemon.evolvesFrom.conditionVi})\n`;
    }
    if (pokemon.evolvesTo.length > 0) {
      text += `Tiến hóa thành:\n`;
      pokemon.evolvesTo.forEach(t => {
        text += ` - ${t.targetName} (#${t.targetId}): ${t.conditionVi}\n`;
      });
    } else if (pokemon.stage === 'single') {
      text += `Không tiến hóa (Dạng độc lập)\n`;
    } else {
      text += `Dạng tiến hóa tối đa\n`;
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      {/* Rotom Phone Crimson Red Smart Tablet Frame */}
      <div
        className="relative w-full max-w-3xl bg-gradient-to-b from-[#EF4444] via-[#DC2626] to-[#991B1B] rounded-3xl sm:rounded-[2.25rem] border-2 border-[#7F1D1D] p-2.5 sm:p-4 shadow-2xl overflow-hidden my-auto"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Chi tiết chuỗi tiến hóa của ${pokemon.name}`}
      >
        {/* Top Rotom Phone Bar */}
        <div className="flex items-center justify-between px-2.5 sm:px-3 pb-2 sm:pb-2.5 text-white">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-950 border border-cyan-400" aria-hidden="true">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Sơ Đồ Tiến Hóa Chi Tiết
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-950 text-red-300 hover:bg-slate-900 border border-red-400/50 transition-colors"
              title="Sao chép thông tin tiến hóa"
              aria-label="Sao chép thông tin tiến hóa"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Đã chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-950 text-slate-200 hover:text-white hover:bg-slate-900 border border-slate-700 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Rotom Phone Edge-to-Edge Smart Screen */}
        <div className="bg-[#090D16] text-slate-100 rounded-2xl sm:rounded-[1.75rem] border-2 border-red-400/50 overflow-hidden shadow-inner">
          {/* Hero Section */}
          <div className="p-4 sm:p-6 bg-slate-950/90 border-b border-slate-800">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-b from-red-950/40 to-slate-900 border border-red-500/30">
                <img
                  src={imgError ? pokemon.thumb : pokemon.sprite}
                  alt={pokemon.name}
                  onError={() => setImgError(true)}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 sm:w-28 sm:h-28 object-contain"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5 sm:space-y-2">
                {/* Unboxed Metadata Kicker */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-mono">
                  <span className="font-bold text-red-400 tabular-nums">
                    {formatDexId(pokemon.id)}
                  </span>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-amber-300 font-semibold">
                    {stageInfo.vi}
                  </span>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-slate-300 tabular-nums">
                    Thế hệ {pokemon.generation}
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {pokemon.name}
                </h2>

                {/* Unboxed Types */}
                <div className="text-xs font-mono tracking-wider text-red-400 font-bold">
                  Hệ: {formatTypesViList(pokemon.types, ' / ')}
                </div>

                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-400 pt-0.5">
                  <Info className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span>
                    Chỉ hiển thị thông tin tiến hóa theo yêu cầu, bỏ qua toàn bộ chỉ số khác.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Evolution Chain Visualization Tree */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-red-400 mb-3 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4" />
                <span>Toàn Bộ Cây Gia Phả Tiến Hóa</span>
              </h4>

              {sortedChain.length <= 1 ? (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <p className="text-sm font-semibold text-slate-300">
                    {`${pokemon.name} là Pokémon độc lập, không có dạng tiến hóa trước hoặc sau.`}
                  </p>
                </div>
              ) : (
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-1">
                    {sortedChain.map((member, index) => {
                      const isCurrent = member.id === pokemon.id;
                      const fullEntry = allPokemon.find(p => p.id === member.id);
                      return (
                        <React.Fragment key={member.id}>
                          <button
                            type="button"
                            onClick={() => {
                              if (fullEntry) {
                                onSelectPokemon(fullEntry);
                              }
                            }}
                            className={`relative flex flex-col items-center p-2.5 sm:p-3 rounded-xl border transition-all min-w-[96px] sm:min-w-[115px] ${
                              isCurrent
                                ? 'bg-red-950/70 border-red-400 ring-1 ring-red-400/50 text-white'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-red-400'
                            }`}
                          >
                            <span className="text-[10px] font-mono font-bold tabular-nums text-red-400">
                              {formatDexId(member.id)}
                            </span>

                            <img
                              src={member.sprite}
                              alt={member.name}
                              referrerPolicy="no-referrer"
                              loading="lazy"
                              className="w-12 h-12 sm:w-16 sm:h-16 object-contain my-1"
                            />

                            <span className="text-xs font-bold text-white">
                              {member.name}
                            </span>

                            <span className="text-[10px] text-slate-400 mt-0.5">
                              {STAGE_LABELS[member.stage]?.vi.split(' (')[0] || member.stage}
                            </span>
                          </button>

                          {index < sortedChain.length - 1 && (
                            <div className="flex flex-col items-center justify-center text-slate-500">
                              <ArrowRight className="w-4 h-4 text-red-400" />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Condition Breakdown Cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Chi Tiết Điều Kiện Tiến Hóa
              </h4>

              {pokemon.evolvesFrom && (
                <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    Cách Tiến Hóa Thành Dạng Này:
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {pokemon.evolvesFrom.conditionVi}
                  </p>
                  <p className="text-xs text-slate-400">
                    {`Phương thức: ${TRIGGER_LABELS[pokemon.evolvesFrom.triggerType]?.vi || pokemon.evolvesFrom.triggerType}`}
                  </p>
                </div>
              )}

              {pokemon.evolvesTo.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-red-400">
                    {`Dạng Tiến Hóa Tiếp Theo (${pokemon.evolvesTo.length} nhánh):`}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {pokemon.evolvesTo.map((target, idx) => {
                      const targetEntry = allPokemon.find(p => p.id === target.targetId);
                      return (
                        <div
                          key={idx}
                          onClick={() => {
                            if (targetEntry) {
                              onSelectPokemon(targetEntry);
                            }
                          }}
                          className="cursor-pointer p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-red-400 transition-colors flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            {targetEntry && (
                              <img
                                src={targetEntry.thumb || targetEntry.sprite}
                                alt={target.targetName}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 object-contain"
                              />
                            )}
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-sm text-white">
                                  {target.targetName}
                                </span>
                                <span className="text-[10px] font-mono tabular-nums text-red-400">
                                  {formatDexId(target.targetId)}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-amber-300 mt-0.5">
                                {target.conditionVi}
                              </p>
                            </div>
                          </div>

                          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {pokemon.stage === 'single' && (
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
                  Pokémon này không có bất kỳ dạng tiến hóa nào trong các thế hệ hiện tại.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Rotom Footer */}
        <div className="pt-2.5 sm:pt-3 px-2.5 sm:px-3 flex items-center justify-between text-white font-semibold">
          <span className="text-xs font-mono">
            Nhấn phím Esc để đóng
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold rounded-xl bg-slate-950 text-white hover:bg-slate-900 border border-red-400/50 transition-colors"
          >
            Đóng lại
          </button>
        </div>
      </div>
    </div>
  );
};
