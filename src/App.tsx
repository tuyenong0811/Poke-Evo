import React, { useState, useMemo, useEffect } from 'react';
import rawData from './data/pokemonEvolutionData.json';
import { PokemonEvolutionEntry, FilterState } from './types/pokemon';
import {
  filterAndSortPokemon,
  groupPokemonByFamily,
  getEvolutionOverviewStats
} from './utils/pokemonLogic';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { PokemonCard } from './components/PokemonCard';
import { FamilyGroupCard } from './components/FamilyGroupCard';
import { PokemonTableView } from './components/PokemonTableView';
import { PokemonEvolutionModal } from './components/PokemonEvolutionModal';
import { EvolutionGuideView } from './components/EvolutionGuideView';
import { PokedexScannerPanel } from './components/PokedexScannerPanel';
import {
  ArrowUp,
  Dna,
  ChevronDown,
  LayoutGrid,
  GitBranch,
  BookOpen
} from 'lucide-react';

const allPokemonData = rawData as PokemonEvolutionEntry[];
const ITEMS_PER_PAGE = 48;

export default function App() {
  const [activeTab, setActiveTab] = useState<'pokedex' | 'families' | 'guide'>('pokedex');
  const [viewMode, setViewMode] = useState<'grid' | 'family' | 'table'>('grid');
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonEvolutionEntry | null>(null);
  const [scannerPokemon, setScannerPokemon] = useState<PokemonEvolutionEntry>(allPokemonData[0]);
  const [page, setPage] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    generation: 'all',
    stage: 'all',
    triggerType: 'all',
    type: 'all',
    sortBy: 'id_asc'
  });

  // Calculate filtered list
  const filteredList = useMemo(() => {
    return filterAndSortPokemon(allPokemonData, filters);
  }, [filters]);

  // Reset pagination and sync scanner to top result when filters change
  useEffect(() => {
    setPage(1);
    if (filteredList.length > 0) {
      setScannerPokemon(filteredList[0]);
    }
  }, [filteredList]);

  // Calculate family groups for family tab or family view mode
  const familyGroups = useMemo(() => {
    return groupPokemonByFamily(allPokemonData, filteredList);
  }, [filteredList]);

  // Statistics summary
  const stats = useMemo(() => {
    return getEvolutionOverviewStats(allPokemonData);
  }, []);

  // Visible sliced list for performance
  const visibleList = useMemo(() => {
    return filteredList.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredList, page]);

  const hasMore = visibleList.length < filteredList.length;

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPokemonCard = (pokemon: PokemonEvolutionEntry) => {
    setScannerPokemon(pokemon);
    setSelectedPokemon(pokemon);
  };

  const handleRandomPokemon = () => {
    const randomIndex = Math.floor(Math.random() * allPokemonData.length);
    const chosen = allPokemonData[randomIndex];
    if (chosen) {
      setScannerPokemon(chosen);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B12] text-slate-100 flex flex-col font-sans pb-16 md:pb-0 selection:bg-red-500 selection:text-white">
      {/* Top Rotom Phone Crimson Crest Bar & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalPokemon={allPokemonData.length}
        totalFamilies={stats.uniqueChainIds}
      />

      {/* Main Rotom Phone Crimson Hardware Chassis */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-2 sm:px-5 lg:px-8 py-2.5 sm:py-5">
        <div className="bg-gradient-to-br from-[#EF4444] via-[#DC2626] to-[#991B1B] rounded-3xl sm:rounded-[2.5rem] p-2 sm:p-4 lg:p-5 border-2 sm:border-4 border-[#7F1D1D] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-5 items-start">
            {/* LEFT PANEL (4 cols): Rotom Phone Smart Scanner Unit */}
            <div className="lg:col-span-4 lg:sticky lg:top-20">
              <PokedexScannerPanel
                activePokemon={scannerPokemon}
                allPokemon={allPokemonData}
                onSelectPokemon={(p) => setScannerPokemon(p)}
                onOpenModal={(p) => {
                  setScannerPokemon(p);
                  setSelectedPokemon(p);
                }}
                onRandomPokemon={handleRandomPokemon}
              />
            </div>

            {/* RIGHT PANEL (8 cols): Rotom Phone Widescreen App Viewport */}
            <div className="lg:col-span-8 bg-[#090D16] rounded-2xl sm:rounded-[2rem] p-2.5 sm:p-5 border-2 border-red-400/50 shadow-inner space-y-3.5 sm:space-y-4">
              {/* TAB 1: POKÉDEX LIST / CARDS / TABLE */}
              {activeTab === 'pokedex' && (
                <div className="space-y-3.5 sm:space-y-4">
                  <FilterBar
                    filters={filters}
                    setFilters={setFilters}
                    viewMode={viewMode}
                    setViewMode={setViewMode}
                    resultCount={filteredList.length}
                    totalCount={allPokemonData.length}
                  />

                  {filteredList.length === 0 ? (
                    <div className="text-center py-12 px-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-3">
                      <Dna className="w-10 h-10 text-red-400 mx-auto" />
                      <h3 className="text-base font-bold text-white">
                        Không tìm thấy Pokémon nào
                      </h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Hãy thử thay đổi từ khóa tìm kiếm hoặc bấm nút "Đặt lại bộ lọc" để xem toàn bộ 1,025 Pokémon.
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setFilters({
                            search: '',
                            generation: 'all',
                            stage: 'all',
                            triggerType: 'all',
                            type: 'all',
                            sortBy: 'id_asc'
                          })
                        }
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors"
                      >
                        Đặt lại bộ lọc
                      </button>
                    </div>
                  ) : viewMode === 'grid' ? (
                    <div className="space-y-4 sm:space-y-5">
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                        {visibleList.map(p => (
                          <PokemonCard
                            key={p.id}
                            pokemon={p}
                            isActive={scannerPokemon.id === p.id}
                            onSelect={handleSelectPokemonCard}
                            onScan={setScannerPokemon}
                          />
                        ))}
                      </div>

                      {hasMore && (
                        <div className="text-center pt-1">
                          <button
                            type="button"
                            onClick={() => setPage(prev => prev + 1)}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 border border-red-400/50 text-xs font-bold text-white transition-colors inline-flex items-center justify-center gap-2 shadow-md"
                          >
                            <span>
                              {`Tải thêm Pokémon (${visibleList.length} / ${filteredList.length})`}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : viewMode === 'family' ? (
                    <div className="space-y-3">
                      {familyGroups.map(family => (
                        <FamilyGroupCard
                          key={family.chainId}
                          family={family}
                          onSelectPokemon={handleSelectPokemonCard}
                        />
                      ))}
                    </div>
                  ) : (
                    <PokemonTableView
                      pokemonList={visibleList}
                      onSelect={handleSelectPokemonCard}
                    />
                  )}
                </div>
              )}

              {/* TAB 2: FAMILIES VIEW */}
              {activeTab === 'families' && (
                <div className="space-y-3.5 sm:space-y-4">
                  <div className="p-3.5 sm:p-4 bg-slate-900 rounded-2xl border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-sm sm:text-base text-white">
                        Chuỗi Gia Phả Tiến Hóa Pokémon
                      </h2>
                      <p className="text-xs text-slate-400">
                        {`Toàn bộ ${familyGroups.length} chuỗi tiến hóa từ Thế hệ 1 đến Thế hệ 9, bao gồm cả chuỗi đơn và các phân nhánh phức tạp.`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        value={filters.search}
                        onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
                        placeholder="Lọc theo tên gia tộc..."
                        className="w-full sm:w-56 text-xs px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {familyGroups.map(family => (
                      <FamilyGroupCard
                        key={family.chainId}
                        family={family}
                        onSelectPokemon={handleSelectPokemonCard}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EVOLUTION GUIDE */}
              {activeTab === 'guide' && (
                <EvolutionGuideView
                  allPokemon={allPokemonData}
                  onSelectPokemon={handleSelectPokemonCard}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (< md) */}
      <nav
        aria-label="Điều hướng di động"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-gradient-to-r from-[#991B1B] via-[#DC2626] to-[#991B1B] border-t-2 border-[#7F1D1D] px-2 py-1.5 shadow-2xl"
      >
        <div className="grid grid-cols-3 gap-1.5 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pokedex')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-bold transition-colors ${
              activeTab === 'pokedex'
                ? 'bg-slate-950 text-white border border-red-300/60 shadow-xs'
                : 'text-red-100 hover:bg-red-800/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4 mb-0.5" />
            <span className="truncate">Pokédex</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('families')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-bold transition-colors ${
              activeTab === 'families'
                ? 'bg-slate-950 text-white border border-red-300/60 shadow-xs'
                : 'text-red-100 hover:bg-red-800/60'
            }`}
          >
            <GitBranch className="w-4 h-4 mb-0.5" />
            <span className="truncate">Gia Phả</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[11px] font-bold transition-colors ${
              activeTab === 'guide'
                ? 'bg-slate-950 text-white border border-red-300/60 shadow-xs'
                : 'text-red-100 hover:bg-red-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4 mb-0.5" />
            <span className="truncate">Cẩm Nang</span>
          </button>
        </div>
      </nav>

      {/* Interactive Full-Screen Rotom Phone Schematic Modal */}
      {selectedPokemon && (
        <PokemonEvolutionModal
          pokemon={selectedPokemon}
          allPokemon={allPokemonData}
          onClose={() => setSelectedPokemon(null)}
          onSelectPokemon={(p) => {
            setScannerPokemon(p);
            setSelectedPokemon(p);
          }}
        />
      )}

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 p-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold border-2 border-red-300 shadow-xl transition-transform hover:scale-105"
          aria-label="Cuộn lên đầu trang"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Quiet Rotom Phone Footer */}
      <footer className="bg-[#060911] border-t border-slate-900 py-4 sm:py-5 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-300">
            Rotom Phone · PokéEvo Từ Điển Tiến Hóa Pokémon Toàn Quốc
          </p>
          <p className="text-[11px] text-slate-500">
            Dữ liệu tuyển chọn: Danh sách Pokémon (#0001 - #1025), hình ảnh minh họa chính thức và điều kiện tiến hóa.
          </p>
        </div>
      </footer>
    </div>
  );
}
