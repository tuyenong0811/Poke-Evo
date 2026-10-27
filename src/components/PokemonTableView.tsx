import React from 'react';
import { PokemonEvolutionEntry } from '../types/pokemon';
import { formatDexId, formatTypesViList, STAGE_LABELS } from '../utils/pokemonLogic';
import { ArrowRight, Eye } from 'lucide-react';

interface PokemonTableViewProps {
  pokemonList: PokemonEvolutionEntry[];
  onSelect: (pokemon: PokemonEvolutionEntry) => void;
}

export const PokemonTableView: React.FC<PokemonTableViewProps> = ({
  pokemonList,
  onSelect
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-700 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
              <th className="py-3 px-3 font-semibold w-16"># Số</th>
              <th className="py-3 px-2 font-semibold w-14 text-center">Ảnh</th>
              <th className="py-3 px-3 font-semibold min-w-[120px]">Tên Pokémon</th>
              <th className="py-3 px-2 font-semibold w-20 text-center">Thế hệ</th>
              <th className="py-3 px-3 font-semibold min-w-[90px]">Hệ</th>
              <th className="py-3 px-3 font-semibold min-w-[110px]">Cấp bậc</th>
              <th className="py-3 px-3 font-semibold min-w-[180px]">Tiến hóa từ đâu & Cách thức</th>
              <th className="py-3 px-3 font-semibold min-w-[220px]">Dạng tiếp theo & Điều kiện</th>
              <th className="py-3 px-3 font-semibold w-16 text-center">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {pokemonList.map(p => {
              const stageInfo = STAGE_LABELS[p.stage] || STAGE_LABELS.base;
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className="hover:bg-slate-800/70 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono font-bold tabular-nums text-red-400">
                    {formatDexId(p.id)}
                  </td>

                  <td className="py-2.5 px-2 text-center">
                    <img
                      src={p.thumb || p.sprite}
                      alt={p.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-10 h-10 object-contain mx-auto"
                    />
                  </td>

                  <td className="py-2.5 px-3 font-bold text-white">
                    {p.name}
                  </td>

                  <td className="py-2.5 px-2 text-center font-mono tabular-nums text-slate-400">
                    Thế hệ {p.generation}
                  </td>

                  <td className="py-2.5 px-3 font-mono text-[11px] text-amber-400 font-semibold">
                    {formatTypesViList(p.types, ' · ')}
                  </td>

                  <td className="py-2.5 px-3 text-slate-300 font-medium">
                    {stageInfo.vi}
                  </td>

                  <td className="py-2.5 px-3">
                    {p.evolvesFrom ? (
                      <span className="font-semibold text-amber-300">
                        {p.evolvesFrom.conditionVi}
                      </span>
                    ) : p.stage === 'single' ? (
                      <span className="text-slate-500 italic">
                        Không tiến hóa
                      </span>
                    ) : (
                      <span className="text-red-300 font-medium">
                        Cấp khởi đầu
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3">
                    {p.evolvesTo.length > 0 ? (
                      <div className="space-y-1">
                        {p.evolvesTo.map((target, idx) => (
                          <div key={idx} className="flex items-center gap-1.5">
                            <ArrowRight className="w-3 h-3 text-red-400 shrink-0" />
                            <span className="font-bold text-white">
                              {target.targetName}:
                            </span>
                            <span className="text-[11px] text-slate-300">
                              {target.conditionVi}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : p.stage === 'single' ? (
                      <span className="text-slate-500 italic">
                        Độc lập
                      </span>
                    ) : (
                      <span className="text-emerald-400 font-semibold">
                        Dạng tiến hóa tối đa
                      </span>
                    )}
                  </td>

                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(p);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition-colors"
                      title="Xem cây tiến hóa"
                      aria-label={`Xem cây tiến hóa của ${p.name}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
