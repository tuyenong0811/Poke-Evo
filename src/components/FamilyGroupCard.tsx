import React from 'react';
import { FamilyGroup, formatDexId, STAGE_LABELS } from '../utils/pokemonLogic';
import { PokemonEvolutionEntry } from '../types/pokemon';
import { ArrowRight, GitBranch } from 'lucide-react';

interface FamilyGroupCardProps {
  family: FamilyGroup;
  onSelectPokemon: (pokemon: PokemonEvolutionEntry) => void;
}

export const FamilyGroupCard: React.FC<FamilyGroupCardProps> = ({
  family,
  onSelectPokemon
}) => {
  const { rootPokemon, members, hasBranching } = family;

  const depth0 = members.filter(m => m.depth === 0);
  const depth1 = members.filter(m => m.depth === 1);
  const depth2 = members.filter(m => m.depth === 2);

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-700/90 p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header of Family Card */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 text-red-400 flex items-center justify-center">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">
                Gia tộc: {rootPokemon.name}
              </h3>
              <span className="font-mono text-xs text-red-400 tabular-nums">
                {formatDexId(rootPokemon.id)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {members.length === 1
                ? 'Không tiến hóa (1 dạng duy nhất)'
                : `${members.length} dạng trong chuỗi`}
              {hasBranching && (
                <span className="ml-1 text-amber-400 font-semibold">
                  · Có phân nhánh tiến hóa
                </span>
              )}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400 tabular-nums">
          Thế hệ {rootPokemon.generation}
        </span>
      </div>

      {/* Evolution Flow Diagram */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-2 overflow-x-auto scrollbar-thin">
        {/* Stage 0 */}
        <div className="flex flex-col items-center gap-2">
          {depth0.map(p => (
            <MemberNode
              key={p.id}
              pokemon={p}
              onSelect={() => onSelectPokemon(p)}
            />
          ))}
        </div>

        {/* Arrow to Stage 1 */}
        {depth1.length > 0 && (
          <div className="flex flex-col items-center justify-center text-center px-1">
            <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-red-400 my-1">
              <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
            </div>
            {depth1.length === 1 && depth1[0].evolvesFrom && (
              <span className="text-[10px] font-semibold text-amber-300 max-w-[130px] leading-tight">
                {depth1[0].evolvesFrom.conditionVi}
              </span>
            )}
          </div>
        )}

        {/* Stage 1 Members */}
        {depth1.length > 0 && (
          <div className="flex flex-wrap md:flex-col items-center justify-center gap-2.5">
            {depth1.map(p => (
              <div key={p.id} className="flex flex-col items-center">
                <MemberNode
                  pokemon={p}
                  onSelect={() => onSelectPokemon(p)}
                />
                {depth1.length > 1 && p.evolvesFrom && (
                  <span className="text-[10px] font-semibold text-amber-300 max-w-[120px] text-center mt-1 leading-tight">
                    {p.evolvesFrom.conditionVi}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Arrow to Stage 2 */}
        {depth2.length > 0 && (
          <div className="flex flex-col items-center justify-center text-center px-1">
            <div className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-red-400 my-1">
              <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
            </div>
            {depth2.length === 1 && depth2[0].evolvesFrom && (
              <span className="text-[10px] font-semibold text-amber-300 max-w-[130px] leading-tight">
                {depth2[0].evolvesFrom.conditionVi}
              </span>
            )}
          </div>
        )}

        {/* Stage 2 Members */}
        {depth2.length > 0 && (
          <div className="flex flex-wrap md:flex-col items-center justify-center gap-2.5">
            {depth2.map(p => (
              <div key={p.id} className="flex flex-col items-center">
                <MemberNode
                  pokemon={p}
                  onSelect={() => onSelectPokemon(p)}
                />
                {depth2.length > 1 && p.evolvesFrom && (
                  <span className="text-[10px] font-semibold text-amber-300 max-w-[120px] text-center mt-1 leading-tight">
                    {p.evolvesFrom.conditionVi}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MemberNode: React.FC<{
  pokemon: PokemonEvolutionEntry;
  onSelect: () => void;
}> = ({ pokemon, onSelect }) => {
  const [imgErr, setImgErr] = React.useState(false);
  const stage = STAGE_LABELS[pokemon.stage] || STAGE_LABELS.base;

  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex flex-col items-center p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-red-400 transition-all text-center min-w-[104px]"
      aria-label={`Xem chi tiết tiến hóa của ${pokemon.name}`}
    >
      <span className="text-[10px] font-mono tabular-nums text-red-400 font-bold">
        {formatDexId(pokemon.id)}
      </span>
      <div className="w-16 h-16 flex items-center justify-center my-0.5">
        <img
          src={imgErr ? pokemon.thumb : pokemon.sprite}
          alt={pokemon.name}
          onError={() => setImgErr(true)}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="w-14 h-14 object-contain group-hover:scale-105 transition-transform duration-150"
        />
      </div>
      <span className="text-xs font-bold text-white group-hover:text-amber-300">
        {pokemon.name}
      </span>
      <span className="text-[10px] text-slate-400 mt-0.5">
        {stage.vi.split(' (')[0]}
      </span>
    </button>
  );
};
