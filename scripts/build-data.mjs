import fs from 'node:fs';
import path from 'node:path';

const ITEM_NAMES_VI = {
  'water-stone': 'Đá Nước (Water Stone)',
  'fire-stone': 'Đá Lửa (Fire Stone)',
  'thunder-stone': 'Đá Lôi (Thunder Stone)',
  'leaf-stone': 'Đá Lá (Leaf Stone)',
  'moon-stone': 'Đá Mặt Trăng (Moon Stone)',
  'sun-stone': 'Đá Mặt Trời (Sun Stone)',
  'shiny-stone': 'Đá Sáng (Shiny Stone)',
  'dusk-stone': 'Đá Hoàng Hôn (Dusk Stone)',
  'dawn-stone': 'Đá Bình Minh (Dawn Stone)',
  'ice-stone': 'Đá Băng (Ice Stone)',
  'oval-stone': 'Đá Bầu Dục (Oval Stone)',
  'kings-rock': "Vương miện King's Rock",
  'metal-coat': 'Áo giáp Metal Coat',
  'dragon-scale': 'Vảy rồng Dragon Scale',
  'up-grade': 'Đĩa nâng cấp Up-Grade',
  'dubious-disc': 'Đĩa Dubious Disc',
  'protector': 'Bộ giáp Protector',
  'electirizer': 'Máy kích điện Electirizer',
  'magmarizer': 'Bộ đốt nhiệt Magmarizer',
  'razor-claw': 'Móng vuốt Razor Claw',
  'razor-fang': 'Răng nanh Razor Fang',
  'reaper-cloth': 'Vải liệm Reaper Cloth',
  'prism-scale': 'Vảy lăng kính Prism Scale',
  'whipped-dream': 'Kem Whipped Dream',
  'sachet': 'Túi hương Sachet',
  'tart-apple': 'Táo Chua (Tart Apple)',
  'sweet-apple': 'Táo Ngọt (Sweet Apple)',
  'syrupy-apple': 'Táo Mật (Syrupy Apple)',
  'cracked-pot': 'Bình nứt (Cracked Pot)',
  'chipped-pot': 'Bình sứt (Chipped Pot)',
  'galarica-cuff': 'Vòng tay Galarica Cuff',
  'galarica-wreath': 'Vòng hoa Galarica Wreath',
  'black-augurite': 'Đá Black Augurite',
  'peat-block': 'Khối than bùn (Peat Block)',
  'auspicious-armor': 'Giáp Auspicious Armor',
  'malicious-armor': 'Giáp Malicious Armor',
  'scroll-of-darkness': 'Cuộn bí kíp Bóng Tối (Scroll of Darkness)',
  'scroll-of-waters': 'Cuộn bí kíp Nước (Scroll of Waters)',
  'unremarkable-teacup': 'Tách trà thông thường (Unremarkable Teacup)',
  'masterpiece-teacup': 'Tách trà kiệt tác (Masterpiece Teacup)',
  'metal-alloy': 'Hợp kim Metal Alloy'
};

function formatName(raw) {
  if (!raw) return '';
  return raw
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function parseEvolutionDetail(detail) {
  const partsVi = [];
  const partsEn = [];
  let triggerType = 'special';

  if (!detail) {
    return {
      vi: 'Điều kiện đặc biệt',
      en: 'Special condition',
      triggerType: 'special'
    };
  }

  const trigger = detail.trigger?.name;

  if (trigger === 'level-up') {
    triggerType = 'level';
    if (detail.min_level) {
      partsVi.push(`Lên Cấp ${detail.min_level}`);
      partsEn.push(`Level ${detail.min_level}`);
    } else {
      partsVi.push('Lên cấp');
      partsEn.push('Level up');
    }

    if (detail.min_happiness) {
      triggerType = 'friendship';
      partsVi.push(`Độ thân mật cao (≥ ${detail.min_happiness})`);
      partsEn.push(`High Friendship (≥ ${detail.min_happiness})`);
    }

    if (detail.min_affection) {
      triggerType = 'friendship';
      partsVi.push(`Tình cảm (Affection ≥ ${detail.min_affection})`);
      partsEn.push(`Affection ≥ ${detail.min_affection}`);
    }

    if (detail.min_beauty) {
      partsVi.push(`Độ đẹp (Beauty ≥ ${detail.min_beauty})`);
      partsEn.push(`Beauty ≥ ${detail.min_beauty}`);
    }

    if (detail.time_of_day) {
      const timeVi = detail.time_of_day === 'day' ? 'Ban ngày' : detail.time_of_day === 'night' ? 'Ban đêm' : detail.time_of_day;
      const timeEn = detail.time_of_day === 'day' ? 'Daytime' : detail.time_of_day === 'night' ? 'Nighttime' : detail.time_of_day;
      partsVi.push(`vào ${timeVi}`);
      partsEn.push(`during ${timeEn}`);
    }

    if (detail.held_item) {
      triggerType = 'item';
      const itemName = detail.held_item.name;
      const viItem = ITEM_NAMES_VI[itemName] || formatName(itemName);
      partsVi.push(`khi giữ ${viItem}`);
      partsEn.push(`holding ${formatName(itemName)}`);
    }

    if (detail.known_move) {
      const moveName = formatName(detail.known_move.name);
      partsVi.push(`học chiêu [${moveName}]`);
      partsEn.push(`knowing move [${moveName}]`);
    }

    if (detail.known_move_type) {
      const typeName = formatName(detail.known_move_type.name);
      partsVi.push(`biết chiêu hệ ${typeName}`);
      partsEn.push(`knowing ${typeName}-type move`);
    }

    if (detail.location) {
      partsVi.push(`tại vị trí ${formatName(detail.location.name)}`);
      partsEn.push(`at ${formatName(detail.location.name)}`);
    }

    if (detail.needs_overworld_rain) {
      partsVi.push('khi trời đang mưa');
      partsEn.push('during rain');
    }

    if (detail.party_species) {
      partsVi.push(`có ${formatName(detail.party_species.name)} trong đội hình`);
      partsEn.push(`with ${formatName(detail.party_species.name)} in party`);
    }

    if (detail.party_type) {
      partsVi.push(`có Pokémon hệ ${formatName(detail.party_type.name)} trong đội hình`);
      partsEn.push(`with ${formatName(detail.party_type.name)}-type in party`);
    }

    if (detail.relative_physical_stats !== null && detail.relative_physical_stats !== undefined) {
      if (detail.relative_physical_stats === 1) {
        partsVi.push('Tấn công > Phòng thủ (Atk > Def)');
        partsEn.push('Attack > Defense');
      } else if (detail.relative_physical_stats === -1) {
        partsVi.push('Phòng thủ > Tấn công (Def > Atk)');
        partsEn.push('Defense > Attack');
      } else if (detail.relative_physical_stats === 0) {
        partsVi.push('Tấn công = Phòng thủ (Atk = Def)');
        partsEn.push('Attack = Defense');
      }
    }

    if (detail.turn_upside_down) {
      partsVi.push('lật ngược máy Nintendo Switch');
      partsEn.push('turn device upside-down');
    }

    if (detail.gender === 1) {
      partsVi.push('(chỉ Pokémon Cái ♀)');
      partsEn.push('(Female ♀ only)');
    } else if (detail.gender === 2) {
      partsVi.push('(chỉ Pokémon Đực ♂)');
      partsEn.push('(Male ♂ only)');
    }
  } else if (trigger === 'use-item') {
    triggerType = detail.item?.name?.includes('-stone') ? 'stone' : 'item';
    const itemName = detail.item ? detail.item.name : 'Vật phẩm';
    const viItem = ITEM_NAMES_VI[itemName] || formatName(itemName);
    partsVi.push(`Dùng ${viItem}`);
    partsEn.push(`Use ${formatName(itemName)}`);

    if (detail.gender === 1) {
      partsVi.push('(chỉ Giới tính Cái ♀)');
      partsEn.push('(Female ♀ only)');
    } else if (detail.gender === 2) {
      partsVi.push('(chỉ Giới tính Đực ♂)');
      partsEn.push('(Male ♂ only)');
    }
  } else if (trigger === 'trade') {
    triggerType = 'trade';
    if (detail.held_item) {
      const itemName = detail.held_item.name;
      const viItem = ITEM_NAMES_VI[itemName] || formatName(itemName);
      partsVi.push(`Trao đổi khi giữ ${viItem}`);
      partsEn.push(`Trade holding ${formatName(itemName)}`);
    } else if (detail.trade_species) {
      partsVi.push(`Trao đổi lấy ${formatName(detail.trade_species.name)}`);
      partsEn.push(`Trade for ${formatName(detail.trade_species.name)}`);
    } else {
      partsVi.push('Trao đổi (Trade)');
      partsEn.push('Trade');
    }
  } else if (trigger === 'shed') {
    triggerType = 'special';
    partsVi.push('Còn 1 ô trống trong đội hình & có Poké Ball dự phòng');
    partsEn.push('Empty party slot & extra Poké Ball in bag');
  } else if (trigger === 'spin') {
    triggerType = 'special';
    partsVi.push('Xoay tròn nhân vật khi giữ kẹo ngọt (Sweet item)');
    partsEn.push('Spin around while holding a Sweet');
  } else if (trigger === 'three-critical-hits') {
    triggerType = 'special';
    partsVi.push('Đạt 3 đòn chí mạng (Critical Hits) trong 1 trận đấu');
    partsEn.push('Land 3 critical hits in a single battle');
  } else if (trigger === 'take-damage') {
    triggerType = 'special';
    partsVi.push('Chịu 49+ sát thương không ngất & đi dưới vòm đá Dusty Bowl');
    partsEn.push('Take 49+ damage without fainting and pass under stone arch');
  } else if (trigger === 'tower-of-darkness') {
    triggerType = 'special';
    partsVi.push('Huấn luyện tại Tháp Bóng Tối (Tower of Darkness)');
    partsEn.push('Train at Tower of Darkness');
  } else if (trigger === 'tower-of-waters') {
    triggerType = 'special';
    partsVi.push('Huấn luyện tại Tháp Nước (Tower of Waters)');
    partsEn.push('Train at Tower of Waters');
  } else {
    triggerType = 'special';
    const trigLower = (trigger || '').toLowerCase();
    if (trigLower.includes('bisharp')) {
      partsVi.push("Đánh bại 3 Bisharp giữ Leader's Crest");
      partsEn.push("Defeat 3 Bisharp holding Leader's Crest");
    } else if (trigLower.includes('recoil') || trigLower.includes('basculin')) {
      partsVi.push('Chịu 294+ sát thương phản hồi (recoil) mà không bị ngất');
      partsEn.push('Take 294+ recoil damage without fainting');
    } else {
      partsVi.push(`Điều kiện: ${formatName(trigger || 'Đặc biệt')}`);
      partsEn.push(`Condition: ${formatName(trigger || 'Special')}`);
    }
  }

  return {
    vi: partsVi.join(' + ') || 'Không rõ',
    en: partsEn.join(' + ') || 'Unknown',
    triggerType
  };
}

function extractIdFromUrl(url) {
  const match = url.match(/\/(\d+)\/?$/);
  return match ? parseInt(match[1], 10) : 0;
}

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
  return res.json();
}

async function run() {
  console.log('Fetching Generation mapping (1 to 9)...');
  const genSpeciesMap = new Map(); // id -> genNumber
  for (let g = 1; g <= 9; g++) {
    try {
      const genData = await fetchJson(`https://pokeapi.co/api/v2/generation/${g}/`);
      for (const sp of genData.pokemon_species) {
        const id = extractIdFromUrl(sp.url);
        if (id <= 1025) {
          genSpeciesMap.set(id, g);
        }
      }
    } catch (e) {
      console.warn(`Failed gen ${g}:`, e.message);
    }
  }
  console.log(`Mapped ${genSpeciesMap.size} species to generations.`);

  console.log('Fetching Type mapping (1 to 18)...');
  const typeMap = new Map(); // id -> string[]
  for (let t = 1; t <= 18; t++) {
    try {
      const typeData = await fetchJson(`https://pokeapi.co/api/v2/type/${t}/`);
      const typeName = typeData.name;
      for (const p of typeData.pokemon) {
        const id = extractIdFromUrl(p.pokemon.url);
        if (id <= 1025) {
          if (!typeMap.has(id)) typeMap.set(id, []);
          typeMap.get(id).push(typeName);
        }
      }
    } catch (e) {
      console.warn(`Failed type ${t}:`, e.message);
    }
  }
  console.log(`Mapped types for ${typeMap.size} pokemon.`);

  console.log('Fetching list of evolution chains...');
  const cachePath = path.resolve('scripts/.pokeapi-cache.json');
  let rawChains = [];
  if (fs.existsSync(cachePath)) {
    console.log('Loading evolution chains from cache...');
    rawChains = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } else {
    const chainsList = await fetchJson('https://pokeapi.co/api/v2/evolution-chain/?limit=600');
    const chainUrls = chainsList.results.map(r => r.url);
    console.log(`Total chains to fetch: ${chainUrls.length}`);

    const BATCH_SIZE = 25;
    for (let i = 0; i < chainUrls.length; i += BATCH_SIZE) {
      const chunk = chainUrls.slice(i, i + BATCH_SIZE);
      const results = await Promise.all(
        chunk.map(url =>
          fetchJson(url).catch(err => {
            console.warn(`Error fetching ${url}:`, err.message);
            return null;
          })
        )
      );
      rawChains.push(...results.filter(Boolean));
      process.stdout.write(`Fetched ${Math.min(i + BATCH_SIZE, chainUrls.length)}/${chainUrls.length}\r`);
    }
    fs.writeFileSync(cachePath, JSON.stringify(rawChains));
    console.log('\nCached raw chains to', cachePath);
  }

  // Parse chains into Pokemon entries and family trees
  const pokemonMap = new Map(); // id -> PokemonEntry
  const families = []; // Array of FamilyTree

  for (const chainData of rawChains) {
    const chainId = chainData.id;
    const rootNode = chainData.chain;
    if (!rootNode || !rootNode.species) continue;

    // We traverse root node and collect all nodes in this chain
    const chainMembers = [];

    function traverse(node, parentId = null, depth = 0) {
      const currentId = extractIdFromUrl(node.species.url);
      if (currentId > 1025) return; // Keep National Dex 1-1025

      const currentName = node.species.name;
      const formattedCurrentName = formatName(currentName);

      // Helper to pick the best evolution detail
      function pickDetail(details) {
        if (!details || details.length === 0) return null;
        return details.find(d => d.is_default) || details[details.length - 1] || details[0];
      }

      // Evolution details to reach this node (from parent)
      let evoFrom = null;
      if (parentId && node.evolution_details && node.evolution_details.length > 0) {
        const detail = pickDetail(node.evolution_details);
        const parsed = parseEvolutionDetail(detail);
        evoFrom = {
          fromId: parentId,
          conditionVi: parsed.vi,
          conditionEn: parsed.en,
          triggerType: parsed.triggerType
        };
      }

      // Next evolutions from this node
      const evolvesTo = [];
      for (const child of node.evolves_to) {
        const childId = extractIdFromUrl(child.species.url);
        if (childId > 1025) continue;
        const childDetail = pickDetail(child.evolution_details);
        const parsed = parseEvolutionDetail(childDetail);
        evolvesTo.push({
          targetId: childId,
          targetName: formatName(child.species.name),
          conditionVi: parsed.vi,
          conditionEn: parsed.en,
          triggerType: parsed.triggerType
        });
      }

      let stage = 'base';
      if (node.is_baby) {
        stage = 'baby';
      } else if (depth === 0) {
        stage = (node.evolves_to.length === 0) ? 'single' : 'base';
      } else if (depth === 1) {
        stage = 'stage1';
      } else if (depth >= 2) {
        stage = 'stage2';
      }

      const entry = {
        id: currentId,
        name: formattedCurrentName,
        slug: currentName,
        generation: genSpeciesMap.get(currentId) || (currentId <= 151 ? 1 : currentId <= 251 ? 2 : currentId <= 386 ? 3 : currentId <= 493 ? 4 : currentId <= 649 ? 5 : currentId <= 721 ? 6 : currentId <= 809 ? 7 : currentId <= 905 ? 8 : 9),
        types: typeMap.get(currentId) || ['normal'],
        chainId,
        stage,
        depth,
        evolvesFrom: evoFrom,
        evolvesTo,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${currentId}.png`,
        thumb: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentId}.png`
      };

      pokemonMap.set(currentId, entry);
      chainMembers.push(entry);

      for (const child of node.evolves_to) {
        traverse(child, currentId, depth + 1);
      }
    }

    traverse(rootNode, null, 0);

    if (chainMembers.length > 0) {
      families.push({
        chainId,
        basePokemonId: chainMembers[0].id,
        basePokemonName: chainMembers[0].name,
        memberIds: chainMembers.map(m => m.id),
        totalStages: Math.max(...chainMembers.map(m => m.depth)) + 1,
        hasBranching: chainMembers.some(m => m.evolvesTo.length > 1)
      });
    }
  }

  // Ensure all 1025 exist even if any single-stage pokemon didn't have an evolution chain
  console.log(`Total Pokemon mapped from chains: ${pokemonMap.size}`);
  for (let id = 1; id <= 1025; id++) {
    if (!pokemonMap.has(id)) {
      pokemonMap.set(id, {
        id,
        name: `Pokemon #${id}`,
        slug: `pokemon-${id}`,
        generation: genSpeciesMap.get(id) || 1,
        types: typeMap.get(id) || ['normal'],
        chainId: 9000 + id,
        stage: 'single',
        depth: 0,
        evolvesFrom: null,
        evolvesTo: [],
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        thumb: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
      });
    }
  }

  const allPokemon = Array.from(pokemonMap.values()).sort((a, b) => a.id - b.id);

  // Group by chainId to easily attach full chain array
  const chainMembersMap = new Map();
  for (const p of allPokemon) {
    if (!chainMembersMap.has(p.chainId)) chainMembersMap.set(p.chainId, []);
    chainMembersMap.get(p.chainId).push({
      id: p.id,
      name: p.name,
      stage: p.stage,
      depth: p.depth,
      evolvesFrom: p.evolvesFrom,
      evolvesTo: p.evolvesTo,
      sprite: p.sprite,
      types: p.types
    });
  }

  // Attach chainSummary to each pokemon
  for (const p of allPokemon) {
    p.chainMembers = chainMembersMap.get(p.chainId) || [];
  }

  const outDir = path.resolve('src/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, 'pokemonEvolutionData.json');
  fs.writeFileSync(outPath, JSON.stringify(allPokemon, null, 2));
  console.log(`Saved ${allPokemon.length} Pokémon evolution records to ${outPath}`);
  console.log(`File size: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
}

run().catch(console.error);
