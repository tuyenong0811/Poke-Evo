import React from 'react';

interface HeaderProps {
  activeTab: 'pokedex' | 'families' | 'guide';
  setActiveTab: (tab: 'pokedex' | 'families' | 'guide') => void;
  totalPokemon: number;
  totalFamilies: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  totalPokemon,
  totalFamilies
}) => {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-[#B91C1C] via-[#DC2626] to-[#B91C1C] text-white border-b-2 sm:border-b-4 border-[#7F1D1D] shadow-lg">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-8 py-2.5 sm:py-3">
          {/* Zone 1: Rotom Phone Emblem (Cyan Eyes + Red Spike Crest) + Single-line Brand Wordmark */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className="relative flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-2xl bg-slate-950 border-2 border-cyan-400 shadow-xs shrink-0"
              aria-hidden="true"
            >
              {/* Left Rotom Eye */}
              <div className="w-3 sm:w-3.5 h-3.5 sm:h-4 rounded-full bg-cyan-400 flex items-center justify-center">
                <div className="w-full h-1 bg-white" />
              </div>
              {/* Center Rotom Spike */}
              <div className="w-1.5 h-2.5 sm:h-3 bg-red-500 rotate-12 rounded-xs" />
              {/* Right Rotom Eye */}
              <div className="w-3 sm:w-3.5 h-3.5 sm:h-4 rounded-full bg-cyan-400 flex items-center justify-center">
                <div className="w-full h-1 bg-white" />
              </div>
            </div>

            <h1 className="text-base sm:text-xl font-extrabold tracking-tight text-white truncate">
              Rotom Phone · PokéEvo
            </h1>
          </div>

          {/* Zone 2: Desktop Navigation Tabs (hidden on < md since mobile uses bottom navigation bar) */}
          <nav
            aria-label="Điều hướng chính Pokédex"
            className="hidden md:flex items-center gap-1.5 lg:gap-2 overflow-x-auto scrollbar-none py-0.5"
          >
            <button
              type="button"
              onClick={() => setActiveTab('pokedex')}
              aria-label="Danh sách Pokémon"
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'pokedex'
                  ? 'bg-slate-950 text-white border border-red-300/60 shadow-xs'
                  : 'text-red-50 hover:bg-red-800/80 hover:text-white'
              }`}
            >
              {`Pokédex (${totalPokemon})`}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('families')}
              aria-label="Chuỗi gia phả tiến hóa"
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'families'
                  ? 'bg-slate-950 text-white border border-red-300/60 shadow-xs'
                  : 'text-red-50 hover:bg-red-800/80 hover:text-white'
              }`}
            >
              {`Chuỗi Gia Phả (${totalFamilies})`}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              aria-label="Cẩm nang tiến hóa"
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'guide'
                  ? 'bg-slate-950 text-white border border-red-300/60 shadow-xs'
                  : 'text-red-50 hover:bg-red-800/80 hover:text-white'
              }`}
            >
              Cẩm Nang Đá & Trao Đổi
            </button>
          </nav>

          {/* Zone 3: Vietnamese National Dex Status Indicator */}
          <div className="hidden sm:flex items-center shrink-0">
            <span className="px-2.5 py-1 rounded-xl bg-slate-950/90 border border-red-300/40 text-[11px] font-mono font-bold text-amber-300 tabular-nums whitespace-nowrap">
              {`#0001 - #${totalPokemon}`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
