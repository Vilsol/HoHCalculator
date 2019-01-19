import {Effect, LoadEffects} from './effects';
import {ClassToUnit, Unit} from './units';
import {GameState, ResultDamage} from './game';
import {globalRootPath, loadFile} from '../sval/loader';

export abstract class Action {

  protected constructor(data: any) {
    this.class = data.class;
  }

  readonly class: string;

  static svalKeys(sval: any): any {
    return {
      class: sval.class
    };
  }

  abstract calculateDamage(state: GameState): ResultDamage;

}

export class ExplodeAction extends Action {

  constructor(data: any) {
    super(data);
    this.effects = data.effects;
  }

  readonly effects: Effect[];

  static fromSval(sval: any): ExplodeAction {
    return new ExplodeAction({
      ...Action.svalKeys(sval),
      effects: LoadEffects(sval)
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class SpawnUnitAction extends Action {

  constructor(data: any) {
    super(data);
    this.unit = data.unit;
  }

  readonly unit: Unit;

  static fromSval(sval: any): SpawnUnitAction {
    return new SpawnUnitAction({
      ...Action.svalKeys(sval),
      unit: ClassToUnit(loadFile(globalRootPath, sval['unit'])[0])
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class ScorchEarthAction extends Action {

  constructor(data: any) {
    super(data);
    this.duration = data.duration || this.duration;
    this.chance = data.chance || this.chance;
  }

  readonly duration: number = 2000;
  readonly chance: number = 1;

  static fromSval(sval: any): ScorchEarthAction {
    return new ScorchEarthAction({
      ...Effect.svalKeys(sval),
      duration: sval['duration'],
      chance: sval['chance']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class HwSpawnUnit extends Action {

  constructor(data: any) {
    super(data);
    this.units = data.units;
    this.safeSpawn = data.safeSpawn || this.safeSpawn;
    this.safeDist = data.safeDist || this.safeDist;
    this.aggro = data.aggro || this.aggro;
  }

  readonly units: Unit[];
  readonly safeSpawn: boolean = false;
  readonly safeDist: number = 0;
  readonly aggro: boolean = false;

  static fromSval(sval: any): HwSpawnUnit {
    return new HwSpawnUnit({
      ...Effect.svalKeys(sval),
      units: sval['units'].filter(p => typeof p === 'string').map(unit => ClassToUnit(loadFile(globalRootPath, unit)[0])),
      safeSpawn: sval['safe-spawn'],
      safeDist: sval['safe-dist'],
      aggro: sval['aggro']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export function ClassToAction(sval: any): Action {
  if (class_to_action[sval['class']]) {
    if (class_to_action[sval['class']]['fromSval']) {
      return class_to_action[sval['class']]['fromSval'](sval);
    } else {
      throw new Error('Invalid action config: ' + sval['class']);
    }
  }

  throw new Error('Action not found: ' + sval['class']);
}

export function LoadActions(sval: any, prefix = ''): Action[] {
  if (sval[prefix + 'action']) {
    return [ClassToAction(sval[prefix + 'action'])];
  }
  if (sval[prefix + 'actions']) {
    return sval[prefix + 'actions'].map(action => ClassToAction(action));
  }

  return [];
}

const class_to_action = {
  'Explode': ExplodeAction,
  'SpawnUnit': SpawnUnitAction,
  'Skills::ScorchEarth': ScorchEarthAction,
  'HwSpawnUnit': HwSpawnUnit,
};
