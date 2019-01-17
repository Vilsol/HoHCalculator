import {GameState, ResultDamage} from './game';

export abstract class Effect {

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

export class Damage extends Effect {

  constructor(data: any) {
    super(data);
    this.physical = data.physical || data.dmg || this.physical;
    this.magical = data.magical || this.magical;
    this.armorMul = data.armorMul || this.armorMul;
    this.resistanceMul = data.resistanceMul || this.resistanceMul;
    this.melee = data.melee || this.melee;
    this.trueStrike = data.trueStrike || this.trueStrike;
  }

  readonly physical: number = 0;
  readonly magical: number = 0;
  readonly armorMul: number = 1;
  readonly resistanceMul: number = 1;
  readonly melee: boolean = false;
  readonly trueStrike: boolean = false;

  static fromSval(sval: any): Damage {
    return new Damage({
      ...Effect.svalKeys(sval),
      physical: sval['physical'],
      magical: sval['magical'],
      armorMul: sval['armor-mul'],
      resistanceMul: sval['resistance-mul'],
      melee: sval['melee'],
      trueStrike: sval['true-strike']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    // TODO Cleaving Damage
    const result = {
      physical: this.physical || 0,
      magical: this.magical || 0
    };

    if (!this.trueStrike) {
      if (state.evadePhysical >= Math.random()) {
        result.physical = 0;
      }

      if (state.evadeMagical >= Math.random()) {
        result.magical = 0;
      }

      if (result.physical === 0 && result.magical === 0) {
        return result;
      }
    }

    return applyArmorParts(result, state, this.armorMul, this.resistanceMul);
  }

}

export class Decimate extends Effect {

  constructor(data: any) {
    super(data);
    this.amount = data.amount;
    this.amountMax = data['amount-max'];
    this.mana = data.mana;
    this.manaMax = data['mana-max'];
  }

  readonly amount: number;
  readonly amountMax: number;
  readonly mana: number;
  readonly manaMax: number;

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class GiveMana extends Effect {

  constructor(data: any) {
    super(data);
    this.mana = data.mana;
  }

  readonly mana: number;

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Heal extends Effect {

  constructor(data: any) {
    super(data);
    this.heal = data.heal;
  }

  readonly heal: number;

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class LifestealDamage extends Effect {

  constructor(data: any) {
    super(data);
    this.lifesteal = data.lifesteal;
    this.manasteal = data.manasteal;
  }

  readonly lifesteal: number;
  readonly manasteal: number;

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class ApplyBuff extends Effect {

  constructor(data: any) {
    super(data);
    this.buff = data.buff;
  }

  readonly buff: any;

  static fromSval(sval: any): ApplyBuff {
    return new ApplyBuff({
      ...Effect.svalKeys(sval),
      buff: sval['buff'] // TODO Convert
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class ExplodeEffect extends Effect {

  constructor(data: any) {
    super(data);
    this.selfDamage = data.selfDamage || this.selfDamage;
    this.teamDamage = data.teamDamage || this.teamDamage;
    this.enemyDamage = data.enemyDamage || this.enemyDamage;
    this.effects = data.effects || this.effects;
  }

  readonly selfDamage: number = 0;
  readonly teamDamage: number = 0;
  readonly enemyDamage: number = 0;
  readonly effects: Effect[] = [];

  static fromSval(sval: any): ApplyBuff {
    return new ApplyBuff({
      ...Effect.svalKeys(sval),
      selfDamage: sval['self-damage'],
      teamDamage: sval['team-damage'],
      enemyDamage: sval['enemy-damage'],
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

export function ClassToEffect(sval: any): Effect {
  if (class_to_effect[sval['class']]) {
    if (class_to_effect[sval['class']]['fromSval']) {
      return class_to_effect[sval['class']]['fromSval'](sval);
    } else {
      throw new Error('Invalid effect config: ' + sval['class']);
    }
  }

  throw new Error('Effect not found: ' + sval['class']);
}

const class_to_effect = {
  'Damage': Damage,
  'Decimate': Decimate,
  'GiveMana': GiveMana,
  'Heal': Heal,
  'LifestealDamage': LifestealDamage,
  'ApplyBuff': ApplyBuff,
  'Explode': ExplodeEffect,
};

function roundDamage(damage: number): number {
  if (damage === 0) {
    return 0;
  }

  let result = 0;
  if (damage < 0) {
    result = Math.ceil(damage - 0.5);
  } else {
    result = Math.floor(damage + 0.5);
  }

  if (damage > 0 && damage < 1) {
    result = 1;
  } else if (damage < 0 && damage > -1) {
    result = -1;
  }

  return result;
}

function calcArmor(armor: number): number {
  const armorTemp = (armor * 0.02);
  return 1 - armorTemp / (1 + Math.max(0, armorTemp));
}

function applyArmorParts(result: ResultDamage, state: GameState, armorMul: number, resistanceMul: number): ResultDamage {
  return {
    physical: calcArmor(state.armor * armorMul) * state.damageMultiplier * result.physical,
    magical: calcArmor(state.resistance * resistanceMul) * state.damageMultiplier * result.magical
  };
}

export function LoadEffects(sval: any, prefix = ''): Effect[] {
  if (sval[prefix + 'effect']) {
    return [ClassToEffect(sval[prefix + 'effect'])];
  }
  if (sval[prefix + 'effects']) {
    return sval[prefix + 'effects'].map(effect => ClassToEffect(effect));
  }

  return [];
}
