import {GameState, ResultDamage} from './game';

export abstract class Buff {

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


export function ClassToBuff(sval: any): Buff {
  if (class_to_buff[sval['class']]) {
    if (class_to_buff[sval['class']]['fromSval']) {
      return class_to_buff[sval['class']]['fromSval'](sval);
    } else {
      throw new Error('Invalid buff config: ' + sval['class']);
    }
  }

  throw new Error('Buff not found: ' + sval['class']);
}


const class_to_buff = {};
