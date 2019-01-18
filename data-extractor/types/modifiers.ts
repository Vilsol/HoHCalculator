import {GameState, ResultDamage} from './game';

export abstract class Modifier {

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

export function ClassToModifier(sval: any): Modifier {
  if (class_to_modifier[sval['class']]) {
    if (class_to_modifier[sval['class']]['fromSval']) {
      return class_to_modifier[sval['class']]['fromSval'](sval);
    } else {
      throw new Error('Invalid modifier config: ' + sval['class']);
    }
  }

  throw new Error('Modifier not found: ' + sval['class']);
}

export function LoadModifiers(sval: any, prefix = ''): Modifier[] {
  if (sval[prefix + 'modifier']) {
    return [ClassToModifier(sval[prefix + 'modifier'])];
  }
  if (sval[prefix + 'modifier']) {
    return sval[prefix + 'modifier'].map(modifier => ClassToModifier(modifier));
  }

  return [];
}

const class_to_modifier = {};
