import {Effect, LoadEffects, ScorchEarth} from './effects';
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
  'Skills::ScorchEarth': ScorchEarth,
};
