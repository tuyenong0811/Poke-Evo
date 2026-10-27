export type EvolutionStage = 'baby' | 'base' | 'stage1' | 'stage2' | 'single';

export type EvolutionTriggerType = 'level' | 'stone' | 'trade' | 'friendship' | 'item' | 'special' | 'none';

export interface EvolutionTarget {
  targetId: number;
  targetName: string;
  conditionVi: string;
  conditionEn: string;
  triggerType: EvolutionTriggerType;
}

export interface EvolutionSource {
  fromId: number;
  conditionVi: string;
  conditionEn: string;
  triggerType: EvolutionTriggerType;
}

export interface ChainMemberSummary {
  id: number;
  name: string;
  stage: EvolutionStage;
  depth: number;
  evolvesFrom: EvolutionSource | null;
  evolvesTo: EvolutionTarget[];
  sprite: string;
  types: string[];
}

export interface PokemonEvolutionEntry {
  id: number;
  name: string;
  slug: string;
  generation: number;
  types: string[];
  chainId: number;
  stage: EvolutionStage;
  depth: number;
  evolvesFrom: EvolutionSource | null;
  evolvesTo: EvolutionTarget[];
  sprite: string;
  thumb: string;
  chainMembers: ChainMemberSummary[];
}

export interface FilterState {
  search: string;
  generation: number | 'all';
  stage: EvolutionStage | 'all';
  triggerType: EvolutionTriggerType | 'all';
  type: string | 'all';
  sortBy: 'id_asc' | 'id_desc' | 'name_asc' | 'name_desc' | 'stages_desc';
}

export interface EvolutionGuideCategory {
  id: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  items: {
    key: string;
    nameVi: string;
    nameEn: string;
    pokemonIds: number[];
    instructionVi: string;
  }[];
}
