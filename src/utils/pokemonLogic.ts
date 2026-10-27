import {
  PokemonEvolutionEntry,
  FilterState,
  EvolutionStage,
  EvolutionTriggerType
} from '../types/pokemon';

export function formatDexId(id: number): string {
  return '#' + id.toString().padStart(4, '0');
}

export const GENERATION_NAMES: Record<number, { nameVi: string; region: string; years: string }> = {
  1: { nameVi: 'Thế hệ 1', region: 'Kanto', years: '1996' },
  2: { nameVi: 'Thế hệ 2', region: 'Johto', years: '1999' },
  3: { nameVi: 'Thế hệ 3', region: 'Hoenn', years: '2002' },
  4: { nameVi: 'Thế hệ 4', region: 'Sinnoh', years: '2006' },
  5: { nameVi: 'Thế hệ 5', region: 'Unova', years: '2010' },
  6: { nameVi: 'Thế hệ 6', region: 'Kalos', years: '2013' },
  7: { nameVi: 'Thế hệ 7', region: 'Alola', years: '2016' },
  8: { nameVi: 'Thế hệ 8', region: 'Galar / Hisui', years: '2019' },
  9: { nameVi: 'Thế hệ 9', region: 'Paldea', years: '2022' }
};

export const STAGE_LABELS: Record<EvolutionStage, { vi: string; color: string }> = {
  baby: { vi: 'Dạng sơ sinh', color: 'bg-pink-100 text-pink-700 border-pink-300 dark:bg-pink-950/60 dark:text-pink-300 dark:border-pink-800' },
  base: { vi: 'Cấp cơ bản', color: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' },
  stage1: { vi: 'Tiến hóa cấp 1', color: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' },
  stage2: { vi: 'Tiến hóa cấp 2 (Tối đa)', color: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' },
  single: { vi: 'Không tiến hóa (Độc lập)', color: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' }
};

export const TRIGGER_LABELS: Record<EvolutionTriggerType, { vi: string }> = {
  level: { vi: 'Lên cấp' },
  stone: { vi: 'Đá tiến hóa' },
  trade: { vi: 'Trao đổi' },
  friendship: { vi: 'Độ thân mật' },
  item: { vi: 'Vật phẩm đặc biệt' },
  special: { vi: 'Cơ chế đặc biệt' },
  none: { vi: 'Không tiến hóa' }
};

export const TYPE_LABELS_VI: Record<string, string> = {
  normal: 'Thường',
  fire: 'Lửa',
  water: 'Nước',
  grass: 'Cỏ',
  electric: 'Điện',
  ice: 'Băng',
  fighting: 'Giác đấu',
  poison: 'Độc',
  ground: 'Đất',
  flying: 'Bay',
  psychic: 'Tâm linh',
  bug: 'Côn trùng',
  rock: 'Đá',
  ghost: 'Ma',
  dragon: 'Rồng',
  steel: 'Thép',
  dark: 'Bóng tối',
  fairy: 'Tiên'
};

export function formatTypeVi(type: string): string {
  return TYPE_LABELS_VI[type.toLowerCase()] || type;
}

export function formatTypesViList(types: string[], separator = ' · '): string {
  return types.map(formatTypeVi).join(separator);
}

export function filterAndSortPokemon(
  list: PokemonEvolutionEntry[],
  filters: FilterState
): PokemonEvolutionEntry[] {
  let result = list;

  // Search filter
  if (filters.search.trim()) {
    const q = filters.search.trim().toLowerCase().replace(/^#+/, '');
    result = result.filter(p => {
      const matchId = p.id.toString() === q || p.id.toString().padStart(4, '0').includes(q);
      const matchName = p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
      const matchTypeVi = p.types.some(t => formatTypeVi(t).toLowerCase().includes(q));
      const matchTarget = p.evolvesTo.some(t => t.targetName.toLowerCase().includes(q) || t.conditionVi.toLowerCase().includes(q));
      const matchSource = p.evolvesFrom ? p.evolvesFrom.conditionVi.toLowerCase().includes(q) : false;
      return matchId || matchName || matchTypeVi || matchTarget || matchSource;
    });
  }

  // Generation filter
  if (filters.generation !== 'all') {
    result = result.filter(p => p.generation === filters.generation);
  }

  // Stage filter
  if (filters.stage !== 'all') {
    result = result.filter(p => p.stage === filters.stage);
  }

  // Trigger Type filter
  if (filters.triggerType !== 'all') {
    if (filters.triggerType === 'none') {
      result = result.filter(p => p.stage === 'single' || (p.evolvesTo.length === 0 && !p.evolvesFrom));
    } else {
      result = result.filter(p => {
        const matchesOut = p.evolvesTo.some(t => t.triggerType === filters.triggerType);
        const matchesIn = p.evolvesFrom?.triggerType === filters.triggerType;
        return matchesOut || matchesIn;
      });
    }
  }

  // Type filter
  if (filters.type !== 'all') {
    result = result.filter(p => p.types.includes(filters.type));
  }

  // Sorting
  return [...result].sort((a, b) => {
    switch (filters.sortBy) {
      case 'id_desc':
        return b.id - a.id;
      case 'name_asc':
        return a.name.localeCompare(b.name);
      case 'name_desc':
        return b.name.localeCompare(a.name);
      case 'stages_desc': {
        const aCount = a.chainMembers?.length || 1;
        const bCount = b.chainMembers?.length || 1;
        return bCount - aCount || a.id - b.id;
      }
      case 'id_asc':
      default:
        return a.id - b.id;
    }
  });
}

export interface FamilyGroup {
  chainId: number;
  rootPokemon: PokemonEvolutionEntry;
  members: PokemonEvolutionEntry[];
  hasBranching: boolean;
  totalStages: number;
}

export function groupPokemonByFamily(
  allPokemon: PokemonEvolutionEntry[],
  filteredPokemon: PokemonEvolutionEntry[]
): FamilyGroup[] {
  const activeChainIds = new Set<number>();
  for (const p of filteredPokemon) {
    activeChainIds.add(p.chainId);
  }

  const groups: FamilyGroup[] = [];

  for (const chainId of activeChainIds) {
    const chainMembers = allPokemon.filter(p => p.chainId === chainId);
    if (chainMembers.length === 0) continue;

    // Find the root (depth 0 or lowest depth)
    const root = chainMembers.reduce((min, curr) => (curr.depth < min.depth ? curr : min), chainMembers[0]);
    const hasBranching = chainMembers.some(m => m.evolvesTo.length > 1);
    const maxDepth = Math.max(...chainMembers.map(m => m.depth));

    groups.push({
      chainId,
      rootPokemon: root,
      members: chainMembers,
      hasBranching,
      totalStages: maxDepth + 1
    });
  }

  // Sort groups by root Pokémon ID
  return groups.sort((a, b) => a.rootPokemon.id - b.rootPokemon.id);
}

export function getEvolutionOverviewStats(allPokemon: PokemonEvolutionEntry[]) {
  const total = allPokemon.length;
  const single = allPokemon.filter(p => p.stage === 'single').length;
  const base = allPokemon.filter(p => p.stage === 'base' || p.stage === 'baby').length;
  const stage1 = allPokemon.filter(p => p.stage === 'stage1').length;
  const stage2 = allPokemon.filter(p => p.stage === 'stage2').length;

  const stoneEvolutions = allPokemon.filter(p =>
    p.evolvesTo.some(t => t.triggerType === 'stone') || p.evolvesFrom?.triggerType === 'stone'
  ).length;

  const tradeEvolutions = allPokemon.filter(p =>
    p.evolvesTo.some(t => t.triggerType === 'trade') || p.evolvesFrom?.triggerType === 'trade'
  ).length;

  const friendshipEvolutions = allPokemon.filter(p =>
    p.evolvesTo.some(t => t.triggerType === 'friendship') || p.evolvesFrom?.triggerType === 'friendship'
  ).length;

  const uniqueChainIds = new Set(allPokemon.map(p => p.chainId)).size;

  return {
    total,
    uniqueChainIds,
    single,
    base,
    stage1,
    stage2,
    stoneEvolutions,
    tradeEvolutions,
    friendshipEvolutions
  };
}
