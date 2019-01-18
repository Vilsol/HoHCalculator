import {GameState, ResultDamage} from './game';
import {ClassToUnit, Unit} from './units';
import {globalRootPath, loadFile} from '../sval/loader';

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
      ...Damage.svalKeys(sval)
    });
  }

  static svalKeys(sval: any): any {
    return {
      ...Effect.svalKeys(sval),
      physical: sval['physical'],
      magical: sval['magical'],
      armorMul: sval['armor-mul'],
      resistanceMul: sval['resistance-mul'],
      melee: sval['melee'],
      trueStrike: sval['true-strike']
    };
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
    this.amount = data.amount || this.amount;
    this.amountMax = data.amountMax || this.amountMax;
    this.mana = data.mana || this.mana;
    this.manaMax = data.manaMax || this.manaMax;
  }

  readonly amount: number = 0;
  readonly amountMax: number = 0;
  readonly mana: number = 0;
  readonly manaMax: number = 0;

  static fromSval(sval: any): Decimate {
    return new Decimate({
      ...Effect.svalKeys(sval),
      amount: sval['amount'],
      amountMax: sval['amount-max'],
      mana: sval['mana'],
      manaMax: sval['mana-max']
    });
  }

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
    this.heal = data.heal || this.heal;
  }

  readonly heal: number = 0;

  static fromSval(sval: any): Heal {
    return new Heal({
      ...Effect.svalKeys(sval),
      heal: sval['heal']
    });
  }

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
  readonly enemyDamage: number = 1;
  readonly effects: Effect[] = [];

  static fromSval(sval: any): ExplodeEffect {
    return new ExplodeEffect({
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

export class BogusDamage extends Damage {

  constructor(data: any) {
    super(data);
  }

  static fromSval(sval: any): BogusDamage {
    return new BogusDamage({
      ...Damage.svalKeys(sval),
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class ScorchEarth extends Effect {

  constructor(data: any) {
    super(data);
    this.duration = data.duration || this.duration;
    this.chance = data.chance || this.chance;
  }

  readonly duration: number = 2000;
  readonly chance: number = 1;

  static fromSval(sval: any): ScorchEarth {
    return new ScorchEarth({
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

export class PlaySound extends Effect {

  constructor(data: any) {
    super(data);
    this.sound = data.sound;
  }

  readonly sound: string;

  static fromSval(sval: any): PlaySound {
    return new PlaySound({
      ...Effect.svalKeys(sval),
      sound: sval['sound']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class SpawnEffect extends Effect {

  constructor(data: any) {
    super(data);
    this.effect = data.effect;
  }

  readonly effect: string;

  static fromSval(sval: any): SpawnEffect {
    return new SpawnEffect({
      ...Effect.svalKeys(sval),
      effect: sval['effect']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class SpawnUnitEffect extends Effect {

  constructor(data: any) {
    super(data);
    this.unit = data.unit;
  }

  readonly unit: Unit[];

  static fromSval(sval: any): SpawnUnitEffect {
    return new SpawnUnitEffect({
      ...Effect.svalKeys(sval),
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

const class_to_effect = {
  'Damage': Damage,
  'Decimate': Decimate,
  'GiveMana': GiveMana,
  'Heal': Heal,
  'LifestealDamage': LifestealDamage,
  'ApplyBuff': ApplyBuff,
  'Explode': ExplodeEffect,
  'BogusDamage': BogusDamage,
  'Skills::ScorchEarth': ScorchEarth,
  'PlaySound': PlaySound,
  'SpawnEffect': SpawnEffect,
  'SpawnUnit': SpawnUnitEffect,
};
