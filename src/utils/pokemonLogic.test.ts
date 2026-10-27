import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatDexId,
  formatTypeVi,
  filterAndSortPokemon,
  groupPokemonByFamily,
  getEvolutionOverviewStats
} from './pokemonLogic';
import { PokemonEvolutionEntry, FilterState } from '../types/pokemon';

const mockPokemon: PokemonEvolutionEntry[] = [
  {
    id: 1,
    name: 'Bulbasaur',
    slug: 'bulbasaur',
    generation: 1,
    types: ['grass', 'poison'],
    chainId: 1,
    stage: 'base',
    depth: 0,
    evolvesFrom: null,
    evolvesTo: [
      {
        targetId: 2,
        targetName: 'Ivysaur',
        conditionVi: 'Lên Cấp 16',
        conditionEn: 'Level 16',
        triggerType: 'level'
      }
    ],
    sprite: 'https://example.com/1.png',
    thumb: 'https://example.com/1-thumb.png',
    chainMembers: []
  },
  {
    id: 2,
    name: 'Ivysaur',
    slug: 'ivysaur',
    generation: 1,
    types: ['grass', 'poison'],
    chainId: 1,
    stage: 'stage1',
    depth: 1,
    evolvesFrom: {
      fromId: 1,
      conditionVi: 'Lên Cấp 16',
      conditionEn: 'Level 16',
      triggerType: 'level'
    },
    evolvesTo: [
      {
        targetId: 3,
        targetName: 'Venusaur',
        conditionVi: 'Lên Cấp 32',
        conditionEn: 'Level 32',
        triggerType: 'level'
      }
    ],
    sprite: 'https://example.com/2.png',
    thumb: 'https://example.com/2-thumb.png',
    chainMembers: []
  },
  {
    id: 3,
    name: 'Venusaur',
    slug: 'venusaur',
    generation: 1,
    types: ['grass', 'poison'],
    chainId: 1,
    stage: 'stage2',
    depth: 2,
    evolvesFrom: {
      fromId: 2,
      conditionVi: 'Lên Cấp 32',
      conditionEn: 'Level 32',
      triggerType: 'level'
    },
    evolvesTo: [],
    sprite: 'https://example.com/3.png',
    thumb: 'https://example.com/3-thumb.png',
    chainMembers: []
  },
  {
    id: 133,
    name: 'Eevee',
    slug: 'eevee',
    generation: 1,
    types: ['normal'],
    chainId: 67,
    stage: 'base',
    depth: 0,
    evolvesFrom: null,
    evolvesTo: [
      {
        targetId: 134,
        targetName: 'Vaporeon',
        conditionVi: 'Dùng Đá Nước',
        conditionEn: 'Use Water Stone',
        triggerType: 'stone'
      },
      {
        targetId: 135,
        targetName: 'Jolteon',
        conditionVi: 'Dùng Đá Lôi',
        conditionEn: 'Use Thunder Stone',
        triggerType: 'stone'
      }
    ],
    sprite: 'https://example.com/133.png',
    thumb: 'https://example.com/133-thumb.png',
    chainMembers: []
  },
  {
    id: 214,
    name: 'Heracross',
    slug: 'heracross',
    generation: 2,
    types: ['bug', 'fighting'],
    chainId: 107,
    stage: 'single',
    depth: 0,
    evolvesFrom: null,
    evolvesTo: [],
    sprite: 'https://example.com/214.png',
    thumb: 'https://example.com/214-thumb.png',
    chainMembers: []
  }
];

test('formatDexId pads number to 4 digits with #', () => {
  assert.equal(formatDexId(1), '#0001');
  assert.equal(formatDexId(25), '#0025');
  assert.equal(formatDexId(1025), '#1025');
});

test('formatTypeVi translates Pokémon elemental types into Vietnamese', () => {
  assert.equal(formatTypeVi('grass'), 'Cỏ');
  assert.equal(formatTypeVi('poison'), 'Độc');
  assert.equal(formatTypeVi('fire'), 'Lửa');
});

test('filterAndSortPokemon filters by search text accurately', () => {
  const baseFilters: FilterState = {
    search: 'eevee',
    generation: 'all',
    stage: 'all',
    triggerType: 'all',
    type: 'all',
    sortBy: 'id_asc'
  };

  const res = filterAndSortPokemon(mockPokemon, baseFilters);
  assert.equal(res.length, 1);
  assert.equal(res[0].id, 133);
});

test('filterAndSortPokemon filters by dex number #0002', () => {
  const filters: FilterState = {
    search: '#0002',
    generation: 'all',
    stage: 'all',
    triggerType: 'all',
    type: 'all',
    sortBy: 'id_asc'
  };

  const res = filterAndSortPokemon(mockPokemon, filters);
  assert.equal(res.length, 1);
  assert.equal(res[0].id, 2);
  assert.equal(res[0].name, 'Ivysaur');
});

test('filterAndSortPokemon filters by generation and stage', () => {
  const filters: FilterState = {
    search: '',
    generation: 2,
    stage: 'single',
    triggerType: 'all',
    type: 'all',
    sortBy: 'id_asc'
  };

  const res = filterAndSortPokemon(mockPokemon, filters);
  assert.equal(res.length, 1);
  assert.equal(res[0].name, 'Heracross');
});

test('filterAndSortPokemon filters by trigger type (stone evolutions)', () => {
  const filters: FilterState = {
    search: '',
    generation: 'all',
    stage: 'all',
    triggerType: 'stone',
    type: 'all',
    sortBy: 'id_asc'
  };

  const res = filterAndSortPokemon(mockPokemon, filters);
  assert.equal(res.length, 1);
  assert.equal(res[0].name, 'Eevee');
});

test('groupPokemonByFamily groups members into their respective chain family', () => {
  const families = groupPokemonByFamily(mockPokemon, mockPokemon);
  assert.equal(families.length, 3);
  
  const bulbaFamily = families.find(f => f.chainId === 1);
  assert.ok(bulbaFamily);
  assert.equal(bulbaFamily.rootPokemon.name, 'Bulbasaur');
  assert.equal(bulbaFamily.members.length, 3);
  assert.equal(bulbaFamily.totalStages, 3);

  const eeveeFamily = families.find(f => f.chainId === 67);
  assert.ok(eeveeFamily);
  assert.equal(eeveeFamily.hasBranching, true);
});

test('getEvolutionOverviewStats calculates correct tallies', () => {
  const stats = getEvolutionOverviewStats(mockPokemon);
  assert.equal(stats.total, 5);
  assert.equal(stats.uniqueChainIds, 3);
  assert.equal(stats.single, 1);
  assert.equal(stats.stage2, 1);
  assert.equal(stats.stoneEvolutions, 1);
});
