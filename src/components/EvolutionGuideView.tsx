import React, { useState } from 'react';
import { PokemonEvolutionEntry } from '../types/pokemon';
import { formatDexId } from '../utils/pokemonLogic';
import { Gem, ArrowLeftRight, Heart, Award, ArrowRight } from 'lucide-react';

interface EvolutionGuideViewProps {
  allPokemon: PokemonEvolutionEntry[];
  onSelectPokemon: (pokemon: PokemonEvolutionEntry) => void;
}

export const EvolutionGuideView: React.FC<EvolutionGuideViewProps> = ({
  allPokemon,
  onSelectPokemon
}) => {
  const [activeSection, setActiveSection] = useState<'stones' | 'trade' | 'friendship' | 'special'>('stones');

  const STONES = [
    { key: 'water-stone', nameVi: 'Đá Nước (Water Stone)' },
    { key: 'fire-stone', nameVi: 'Đá Lửa (Fire Stone)' },
    { key: 'thunder-stone', nameVi: 'Đá Lôi (Thunder Stone)' },
    { key: 'leaf-stone', nameVi: 'Đá Lá (Leaf Stone)' },
    { key: 'moon-stone', nameVi: 'Đá Mặt Trăng (Moon Stone)' },
    { key: 'sun-stone', nameVi: 'Đá Mặt Trời (Sun Stone)' },
    { key: 'shiny-stone', nameVi: 'Đá Sáng (Shiny Stone)' },
    { key: 'dusk-stone', nameVi: 'Đá Hoàng Hôn (Dusk Stone)' },
    { key: 'dawn-stone', nameVi: 'Đá Bình Minh (Dawn Stone)' },
    { key: 'ice-stone', nameVi: 'Đá Băng (Ice Stone)' },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Guide Console Header */}
      <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border-2 border-red-500/30 text-white space-y-2">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
          Cẩm Nang Phương Thức Tiến Hóa
        </div>
        <h2 className="text-lg sm:text-2xl font-extrabold text-white">
          Phân Loại Toàn Bộ Cách Thức Tiến Hóa
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
          Tổng hợp nhanh các dạng tiến hóa bằng Đá, Trao đổi, Độ thân mật và các cơ chế đặc biệt trong Pokémon từ Thế hệ 1 đến Thế hệ 9.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        <button
          type="button"
          onClick={() => setActiveSection('stones')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors whitespace-nowrap ${
            activeSection === 'stones'
              ? 'bg-red-600 text-white font-extrabold shadow-xs'
              : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500'
          }`}
        >
          <Gem className="w-4 h-4" />
          <span>Đá Tiến Hóa (10 Loại Đá)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('trade')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors whitespace-nowrap ${
            activeSection === 'trade'
              ? 'bg-red-600 text-white font-extrabold shadow-xs'
              : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Trao Đổi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('friendship')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors whitespace-nowrap ${
            activeSection === 'friendship'
              ? 'bg-red-600 text-white font-extrabold shadow-xs'
              : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Độ Thân Mật & Thời Gian</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('special')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-colors whitespace-nowrap ${
            activeSection === 'special'
              ? 'bg-red-600 text-white font-extrabold shadow-xs'
              : 'bg-slate-900 text-slate-300 border border-slate-700 hover:border-slate-500'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Cơ Chế Đặc Biệt Thế Hệ Mới</span>
        </button>
      </div>

      {/* Tab 1: Evolution Stones */}
      {activeSection === 'stones' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STONES.map(stone => {
            const transitions: { from: PokemonEvolutionEntry; toName: string; condition: string }[] = [];
            for (const p of allPokemon) {
              for (const target of p.evolvesTo) {
                if (target.conditionEn.toLowerCase().includes(stone.key.replace('-', ' '))) {
                  transitions.push({
                    from: p,
                    toName: target.targetName,
                    condition: target.conditionVi
                  });
                }
              }
            }

            return (
              <div
                key={stone.key}
                className="bg-slate-900 rounded-2xl border border-slate-700 p-4 sm:p-5 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="font-bold text-white text-sm sm:text-base">
                    {stone.nameVi}
                  </h3>
                  <span className="text-xs font-mono tabular-nums text-red-400">
                    {transitions.length} loài
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  {transitions.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectPokemon(item.from)}
                      className="cursor-pointer flex items-center justify-between p-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-red-400/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={item.from.thumb || item.from.sprite}
                          alt={item.from.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 object-contain"
                        />
                        <span className="font-bold text-xs text-slate-100">
                          {item.from.name}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="font-extrabold text-xs text-amber-300">
                        {item.toName}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Trade Evolutions */}
      {activeSection === 'trade' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-700 p-4 sm:p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-base sm:text-lg text-white">
              Tiến Hóa Bằng Trao Đổi
            </h3>
            <p className="text-xs text-slate-400">
              Bao gồm cả trao đổi trực tiếp không cần vật phẩm, trao đổi khi giữ vật phẩm đặc biệt và trao đổi chéo giữa hai loài (Karrablast - Shelmet).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allPokemon
              .filter(p => p.evolvesTo.some(t => t.triggerType === 'trade'))
              .map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectPokemon(p)}
                  className="cursor-pointer p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-red-400 transition-colors flex items-center gap-3"
                >
                  <img
                    src={p.thumb || p.sprite}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-contain shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-mono tabular-nums text-red-400">
                        {formatDexId(p.id)}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-300 font-semibold truncate mt-0.5">
                      {p.evolvesTo.filter(t => t.triggerType === 'trade').map(t => `${t.targetName} (${t.conditionVi})`).join(', ')}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 3: Friendship Evolutions */}
      {activeSection === 'friendship' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-700 p-4 sm:p-5 space-y-4">
          <div className="space-y-1">
            <h3 className="font-bold text-base sm:text-lg text-white">
              Tiến Hóa Bằng Độ Thân Mật & Thời Gian
            </h3>
            <p className="text-xs text-slate-400">
              Để tiến hóa các Pokémon này, người chơi cần tăng Độ thân mật lên mức cao (≥ 160 hoặc 220) bằng cách cho ăn quả mọng, dẫn đi dạo, dùng Chuông Dịu Êm, sau đó lên cấp.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allPokemon
              .filter(p => p.evolvesTo.some(t => t.triggerType === 'friendship'))
              .map(p => (
                <div
                  key={p.id}
                  onClick={() => onSelectPokemon(p)}
                  className="cursor-pointer p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-red-400 transition-colors flex items-center gap-3"
                >
                  <img
                    src={p.thumb || p.sprite}
                    alt={p.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-contain shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-mono tabular-nums text-red-400">
                        {formatDexId(p.id)}
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-300 font-semibold truncate mt-0.5">
                      {p.evolvesTo.filter(t => t.triggerType === 'friendship').map(t => `${t.targetName} (${t.conditionVi})`).join(', ')}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 4: Special / Unique Mechanics */}
      {activeSection === 'special' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              titleVi: 'Charcadet - Armarouge / Ceruledge',
              pId: 935,
              descVi: 'Dùng Giáp Auspicious Armor (tiến hóa thành Armarouge) hoặc Malicious Armor (tiến hóa thành Ceruledge).'
            },
            {
              titleVi: 'Applin - Flapple / Appletun / Dipplin - Hydrapple',
              pId: 840,
              descVi: 'Dùng Táo Chua (Flapple), Táo Ngọt (Appletun), hoặc Táo Mật (Dipplin). Dipplin lên cấp khi biết chiêu Dragon Cheer sẽ thành Hydrapple.'
            },
            {
              titleVi: 'Bisharp - Kingambit',
              pId: 625,
              descVi: "Đánh bại 3 Pokémon Bisharp hoang dã đang dẫn đầu đàn Pawniard và cầm vật phẩm Leader's Crest, sau đó lên cấp."
            },
            {
              titleVi: 'Primeape - Annihilape',
              pId: 57,
              descVi: 'Sử dụng chiêu thức Rage Fist (Cú Đấm Thịnh Nộ) đủ 20 lần trong các trận đấu rồi lên cấp.'
            },
            {
              titleVi: 'Inkay - Malamar',
              pId: 686,
              descVi: 'Đạt từ cấp 30 trở lên và giữ ngược máy chơi game (lộn ngược 180 độ) khi lên cấp.'
            },
            {
              titleVi: 'Gimmighoul - Gholdengo',
              pId: 999,
              descVi: 'Thu thập đủ 999 Đồng xu Gimmighoul trong túi đồ và lên cấp.'
            },
            {
              titleVi: 'Pawmo / Bramblin / Rellor - Pawmot / Brambleghast / Rabsca',
              pId: 922,
              descVi: "Thả Pokémon đi bộ bên cạnh đủ 1.000 bước ở chế độ Let's Go mà không bị thu về bóng, sau đó lên cấp."
            },
            {
              titleVi: 'Finizen - Palafin',
              pId: 963,
              descVi: 'Tham gia chế độ kết nối nhiều người chơi (Union Circle) và lên cấp từ Cấp 38 trở lên.'
            }
          ].map((item, idx) => {
            const entry = allPokemon.find(p => p.id === item.pId);
            return (
              <div
                key={idx}
                onClick={() => {
                  if (entry) onSelectPokemon(entry);
                }}
                className="cursor-pointer bg-slate-900 rounded-2xl border border-slate-700 hover:border-red-400 p-4 sm:p-5 transition-colors space-y-3"
              >
                <div className="flex items-center gap-3">
                  {entry && (
                    <img
                      src={entry.thumb || entry.sprite}
                      alt={entry.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-contain"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-white">
                      {item.titleVi}
                    </h4>
                    <span className="text-[10px] font-mono tabular-nums text-red-400 font-bold">
                      {entry ? formatDexId(entry.id) : ''}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {item.descVi}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
