import {Effect} from './effects';
import {Unit} from './units';

export interface Action {
  class: string;
}

export interface ExplodeAction extends Action {
  effects: Effect[];
}

export interface SpawnUnitAction extends Action {
  unit: Unit;
}
