import * as path from 'path';
import * as fs from 'fs';
import * as fg from 'fast-glob';
import {svalToObject} from './processor';
import {Skill} from '../types';
import {GameState, ResultDamage, sumDamage} from '../types/game';

export let globalRootPath = '';

export function loadData(rootPath: string) {
  globalRootPath = rootPath;

  validateCodebase(rootPath);

  loadCharacter(rootPath, 'paladin');
  loadCharacter(rootPath, 'priest');
  loadCharacter(rootPath, 'ranger');
  loadCharacter(rootPath, 'sorcerer');
  loadCharacter(rootPath, 'thief');
  loadCharacter(rootPath, 'warlock');
  loadCharacter(rootPath, 'wizard');
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
  fg.sync(rootPath + '/**/*.sval').map(file => file.toString().substr(rootPath.length)).forEach(file => {
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
  const character = loadFile(rootPath, 'players/' + name + '/char.sval')[0];

  for (const skillPath of character['skills']) {
    const skill = Skill.fromSval(loadFile(rootPath, skillPath)[0]);
    // console.log(skill);
  }

  /*
  const chargeSkill = loadFile(rootPath, character['skills'][0])[0];
  const skillData = Skill.fromSval(chargeSkill);
  // console.log(JSON.stringify(skillData, undefined, 4));

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
