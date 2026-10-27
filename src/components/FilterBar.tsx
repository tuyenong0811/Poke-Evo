import React from 'react';
import {
  Search,
  X,
  Filter,
  LayoutGrid,
  GitBranch,
  Table as TableIcon,
  RotateCcw
} from 'lucide-react';
import {
  FilterState,
  EvolutionStage,
  EvolutionTriggerType
} from '../types/pokemon';
import {
  STAGE_LABELS,
  TRIGGER_LABELS,
  GENERATION_NAMES,
  formatTypeVi
} from '../utils/pokemonLogic';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: 'grid' | 'family' | 'table';
  setViewMode: (mode: 'grid' | 'family' | 'table') => void;
  resultCount: number;
  totalCount: number;
}

const ALL_TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  resultCount,
  totalCount
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const handleReset = () => {
    setFilters({
      search: '',
      generation: 'all',
      stage: 'all',
      triggerType: 'all',
      type: 'all',
      sortBy: 'id_asc'
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.generation !== 'all' ||
    filters.stage !== 'all' ||
    filters.triggerType !== 'all' ||
    filters.type !== 'all' ||
    filters.sortBy !== 'id_asc';

  return (
    <div className="bg-slate-900/95 text-slate-100 rounded-2xl border border-red-500/30 p-3 sm:p-4 space-y-2.5 sm:space-y-3 shadow-inner">
      {/* Top row: Search Terminal, View Mode, Sort, Filter Toggle */}
      <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-2.5 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
          <input
            type="text"
            value={filters.search}
            onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
            placeholder="Tìm Pokémon (#0025, Pikachu, Eevee, Đá Nước, Cấp 16...)"
            className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:border-red-500 text-slate-100 placeholder-slate-500 font-medium"
            aria-label="Tìm kiếm Pokémon"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode, Sort, and Filter Controls */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          {/* Segmented View Mode Switcher */}
          <div className="flex items-center bg-slate-950 p-0.5 sm:p-1 rounded-xl border border-slate-800 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'grid'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Chế độ Thẻ"
              aria-label="Chế độ Thẻ"
            >
              <LayoutGrid className="hidden sm:inline w-3.5 h-3.5" />
              <span>Thẻ</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('family')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'family'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Chế độ Cây Tiến Hóa"
              aria-label="Chế độ Cây Tiến Hóa"
            >
              <GitBranch className="hidden sm:inline w-3.5 h-3.5" />
              <span>Cây</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
                viewMode === 'table'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Chế độ Bảng Danh Sách"
              aria-label="Chế độ Bảng Danh Sách"
            >
              <TableIcon className="hidden sm:inline w-3.5 h-3.5" />
              <span>Bảng</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 min-w-0">
            {/* Sort selector */}
            <select
              value={filters.sortBy}
              onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as FilterState['sortBy'] }))}
              className="text-[11px] sm:text-xs py-1.5 sm:py-2 px-1.5 sm:px-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-red-500 max-w-[100px] sm:max-w-none truncate"
              aria-label="Sắp xếp danh sách"
            >
              <option value="id_asc">Số # (1-1025)</option>
              <option value="id_desc">Số # (1025-1)</option>
              <option value="name_asc">Tên (A - Z)</option>
              <option value="name_desc">Tên (Z - A)</option>
              <option value="stages_desc">Nhiều bậc nhất</option>
            </select>

            {/* Toggle More Filters */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                showAdvanced || hasActiveFilters
                  ? 'bg-red-600 text-white border-red-400 font-bold'
                  : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
              aria-label="Bộ lọc nâng cao"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Lọc</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
                title="Đặt lại bộ lọc"
                aria-label="Đặt lại bộ lọc"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đặt lại</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Generation Selector Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0 mr-1">
          Thế Hệ:
        </span>
        <button
          type="button"
          onClick={() => setFilters(prev => ({ ...prev, generation: 'all' }))}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 transition-colors whitespace-nowrap ${
            filters.generation === 'all'
              ? 'bg-red-600 text-white font-bold'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          Tất cả (Thế hệ 1-9)
        </button>

        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(gen => {
          const info = GENERATION_NAMES[gen];
          const isSelected = filters.generation === gen;
          return (
            <button
              key={gen}
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, generation: isSelected ? 'all' : gen }))}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors whitespace-nowrap ${
                isSelected
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>Thế hệ {gen}</span>
              <span className="text-[10px] opacity-80">({info.region})</span>
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Drawer (Methods, Stages, Types) */}
      {(showAdvanced || hasActiveFilters) && (
        <div className="pt-2.5 border-t border-slate-800 space-y-2.5">
          {/* Evolution Trigger Methods */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0 mr-1">
              Cách tiến hóa:
            </span>
            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, triggerType: 'all' }))}
              className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filters.triggerType === 'all'
                  ? 'bg-red-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tất cả cách
            </button>

            {(Object.keys(TRIGGER_LABELS) as EvolutionTriggerType[]).map(typeKey => {
              const isSelected = filters.triggerType === typeKey;
              return (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, triggerType: isSelected ? 'all' : typeKey }))}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {TRIGGER_LABELS[typeKey].vi}
                </button>
              );
            })}
          </div>

          {/* Evolution Stages */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0 mr-1">
              Cấp bậc:
            </span>
            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, stage: 'all' }))}
              className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filters.stage === 'all'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tất cả cấp
            </button>

            {(Object.keys(STAGE_LABELS) as EvolutionStage[]).map(st => {
              const isSelected = filters.stage === st;
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, stage: isSelected ? 'all' : st }))}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {STAGE_LABELS[st].vi}
                </button>
              );
            })}
          </div>

          {/* Types */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0 mr-1">
              Hệ nguyên tố:
            </span>
            <button
              type="button"
              onClick={() => setFilters(prev => ({ ...prev, type: 'all' }))}
              className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                filters.type === 'all'
                  ? 'bg-white text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Tất cả hệ
            </button>

            {ALL_TYPES.map(typeName => {
              const isSelected = filters.type === typeName;
              return (
                <button
                  key={typeName}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, type: isSelected ? 'all' : typeName }))}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-colors whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {formatTypeVi(typeName)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Result Count Readout */}
      <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 pt-1 border-t border-slate-800/80 font-mono">
        <div>
          Hiển thị <span className="font-bold text-red-400 tabular-nums">{resultCount}</span> /{' '}
          <span className="tabular-nums">{totalCount}</span> Pokémon
        </div>
      </div>
    </div>
  );
};
