import * as path from 'path';
import * as fs from 'fs';
import * as fg from 'fast-glob';
import {svalToObject} from './processor';
import {Buff, Character, Skill} from '../types';
import {GameState, ResultDamage, sumDamage} from '../types/game';
import {Item} from '../types/items';

export let globalRootPath = '';

const buff_cache = {};

export function loadData(rootPath: string): any {
  globalRootPath = rootPath;

  validateCodebase(rootPath);

  const common = loadItems(rootPath, 'items/common.sval');
  const uncommon = loadItems(rootPath, 'items/uncommon.sval');
  const rare = loadItems(rootPath, 'items/rare.sval');
  const epic = loadItems(rootPath, 'items/epic.sval');
  const legendary = loadItems(rootPath, 'items/legendary.sval');

  const paladin = loadCharacter(rootPath, 'paladin');
  const priest = loadCharacter(rootPath, 'priest');
  const ranger = loadCharacter(rootPath, 'ranger');
  const sorcerer = loadCharacter(rootPath, 'sorcerer');
  const thief = loadCharacter(rootPath, 'thief');
  const warlock = loadCharacter(rootPath, 'warlock');
  const wizard = loadCharacter(rootPath, 'wizard');

  return {
    items: {
      common,
      uncommon,
      rare,
      epic,
      legendary
    },
    players: {
      paladin,
      priest,
      ranger,
      sorcerer,
      thief,
      warlock,
      wizard
    }
  };
}

export function loadFile(rootPath: string, file: string): any[] {
  const absolutePath = path.normalize(path.join(rootPath, file));

  try {
    return svalToObject(fs.readFileSync(absolutePath).toString('utf8'));
  } catch (e) {
    throw new Error('loading SVAL file: ' + absolutePath + '\n' + e);
  }
}

function validateCodebase(rootPath: string) {
  let hasErrors = false;
  fg.sync(rootPath + '/**/*.{sval,unit}').map(file => file.toString().substr(rootPath.length)).forEach(file => {
    try {
      loadFile(rootPath, file);
    } catch (e) {
      console.error('\n', e);
      hasErrors = true;
    }
  });

  if (hasErrors) {
    throw new Error('Errors detected in SVAL codebase!');
  } else {
    console.log('Codebase validated without errors!');
  }
}

function loadCharacter(rootPath: string, name: string) {
  return Character.fromSval(loadFile(rootPath, 'players/' + name + '/char.sval')[0]);
  /*
  const sampleState = {
    enemyCount: 1,
    evadePhysical: 0.1,
    evadeMagical: 0.1,
    armor: 123,
    resistance: 0,
    damageMultiplier: 1,
  };

  console.log(skillData.calculateDamage(3, sampleState));
  console.log(Simulate(skillData, 3, sampleState, 10000));
  */
}

function loadItems(rootPath: string, name: string) {
  const items = {};
  const itemsSval = loadFile(rootPath, name)[0];


  for (const itemKey of Object.keys(itemsSval)) {
    console.log(itemKey);
    items[itemKey] = Item.fromSval(itemsSval[itemKey]);
  }

  return items;
}

function Simulate(skill: Skill, level: number, state: GameState, times: number): ResultDamage {
  const results: ResultDamage[] = [];
  for (let i = 0; i < times; i++) {
    results.push(skill.calculateDamage(level, state));
  }
  return results.reduce(averageDamage);
}

function averageDamage(total: ResultDamage, current: ResultDamage, i: number, arr: ResultDamage[]) {
  total = sumDamage(total, current);
  if (i === arr.length - 1) {
    return {
      physical: total.physical / arr.length,
      magical: total.magical / arr.length
    };
  } else {
    return total;
  }
}

export function LoadBuff(rootPath: string, buffData: string) {
  const file = buffData.split(':')[0];
  const buff = buffData.split(':')[1];

  if (!(file in buff_cache)) {
    buff_cache[file] = {};

    const buffs = loadFile(rootPath, file)[0];

    for (const buffKey of Object.keys(buffs)) {
      buff_cache[file][buffKey] = buffs[buffKey];
    }
  }

  if (buff in buff_cache[file]) {
    if (!(buff_cache[file][buff] instanceof Buff)) {
      buff_cache[file][buff] = Buff.fromSval(buff_cache[file][buff]);
    }

    return buff_cache[file][buff];
  } else {
    throw new Error('Buff not found in file ' + file + ': ' + buff);
  }
}
