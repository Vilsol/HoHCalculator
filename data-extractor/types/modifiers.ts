import {GameState, ResultDamage} from './game';
import {Effect, LoadEffects} from './effects';
import {Buff} from './buffs';
import {globalRootPath, LoadBuff} from '../sval/loader';

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

export class BlockProjectile extends Modifier {

  constructor(data: any) {
    super(data);
    this.arc = (data.arc || this.arc) * Math.PI / 180 + Math.PI;
    this.offset = (data.offset || this.offset) * Math.PI / 180 + Math.PI;
  }

  readonly arc: number = 90;
  readonly offset: number = 0;

  static fromSval(sval: any): BlockProjectile {
    return new BlockProjectile({
      ...Modifier.svalKeys(sval),
      arc: sval['arc'],
      offset: sval['offset'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class TriggerEffect extends Modifier {

  constructor(data: any) {
    super(data);
    this.chance = data.chance || this.chance;
    this.effects = data.effects;
    this.targetSelf = data.targetSelf || this.targetSelf;
    this.trigger = data.trigger || this.trigger;
    this.timeout = data.timeout || this.timeout;
  }

  readonly chance: number = 10;
  readonly effects: Effect[];
  readonly targetSelf: boolean = false;
  readonly trigger: string = '';
  readonly timeout: number = 0;

  static fromSval(sval: any): TriggerEffect {
    return new TriggerEffect({
      ...Modifier.svalKeys(sval),
      chance: sval['chance'],
      effects: LoadEffects(sval),
      targetSelf: sval['target-self'],
      trigger: sval['trigger'],
      timeout: sval['timeout'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class HealthGain extends Modifier {

  constructor(data: any) {
    super(data);
    this.scale = data.scale || this.scale;
    this.scaleAll = data.scaleAll || this.scaleAll;
  }

  readonly scale: number = 1;
  readonly scaleAll: number = 1;

  static fromSval(sval: any): HealthGain {
    return new HealthGain({
      ...Modifier.svalKeys(sval),
      scale: sval['scale'],
      scaleAll: sval['scale-all'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class WarlockCleaverModifier extends Modifier {

  constructor(data: any) {
    super(data);
    this.buff = data.buff;
  }

  readonly buff: Buff;

  static fromSval(sval: any): WarlockCleaverModifier {
    return new WarlockCleaverModifier({
      ...Modifier.svalKeys(sval),
      buff: LoadBuff(globalRootPath, sval['buff'])
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class FlameShield extends Modifier {

  constructor(data: any) {
    super(data);
    this.damageTakenMultiplier = data.damageTakenMultiplier || this.damageTakenMultiplier;
    this.cooldown = data.cooldown;
  }

  readonly damageTakenMultiplier: number = 1;
  readonly cooldown: number;

  static fromSval(sval: any): FlameShield {
    return new FlameShield({
      ...Modifier.svalKeys(sval),
      damageTakenMultiplier: sval['dmg-taken-mul'],
      cooldown: sval['cooldown'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class CleaveRange extends Modifier {

  constructor(data: any) {
    super(data);
    this.multiplier = data.multiplier || this.multiplier;
  }

  readonly multiplier: number = 1;

  static fromSval(sval: any): CleaveRange {
    return new CleaveRange({
      ...Modifier.svalKeys(sval),
      multiplier: sval['mul'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Combo extends Modifier {

  constructor(data: any) {
    super(data);
    this.invert = data.invert || this.invert;
    this.triggerCount = data.triggerCount || this.triggerCount;
    this.unlockTime = data.unlockTime || this.unlockTime;
    this.maintainTime = data.maintainTime || this.maintainTime;
  }

  readonly invert: boolean = false;
  readonly triggerCount: number = 0;
  readonly unlockTime: number = 0;
  readonly maintainTime: number = 0;

  static fromSval(sval: any): Combo {
    return new Combo({
      ...Modifier.svalKeys(sval),
      invert: sval['invert'],
      triggerCount: sval['trigger-count'],
      unlockTime: sval['unlock-time'],
      maintainTime: sval['maintain=-time'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class StatsBase extends Modifier {

  constructor(data: any) {
    super(data);
    this.health = data.health || this.health;
    this.mana = data.mana || this.mana;
  }

  readonly health: number = 0;
  readonly mana: number = 0;

  static fromSval(sval: any): StatsBase {
    return new StatsBase({
      ...Modifier.svalKeys(sval),
      health: sval['health'],
      mana: sval['mana'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Armor extends Modifier {

  constructor(data: any) {
    super(data);
    this.armor = data.armor || this.armor;
    this.resistance = data.resistance || this.resistance;
    this.damageTakenMultiplier = data.damageTakenMultiplier || this.damageTakenMultiplier;
  }

  readonly armor: number = 0;
  readonly resistance: number = 0;
  readonly damageTakenMultiplier: number = 1;

  static fromSval(sval: any): Armor {
    return new Armor({
      ...Modifier.svalKeys(sval),
      armor: sval['armor'],
      resistance: sval['resistance'],
      damageTakenMultiplier: sval['dmg-taken-mul'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class SpellCost extends Modifier {

  constructor(data: any) {
    super(data);
    this.manaMultiplier = data.manaMultiplier || this.manaMultiplier;
  }

  readonly manaMultiplier: number = 1;

  static fromSval(sval: any): SpellCost {
    return new SpellCost({
      ...Modifier.svalKeys(sval),
      manaMultiplier: sval['mana-mul'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Lifestealing extends Modifier {

  constructor(data: any) {
    super(data);
    this.lifesteal = data.lifesteal || this.lifesteal;
    this.spellLifesteal = data.spellLifesteal || this.spellLifesteal;
    this.onlyCrit = data.onlyCrit || this.onlyCrit;
  }

  readonly lifesteal: number = 0;
  readonly spellLifesteal: number = 0;
  readonly onlyCrit: boolean = false;

  static fromSval(sval: any): Lifestealing {
    return new Lifestealing({
      ...Modifier.svalKeys(sval),
      lifesteal: sval['lifesteal'],
      spellLifesteal: sval['spell-lifesteal'],
      onlyCrit: sval['only-crit'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Aura extends Modifier {

  constructor(data: any) {
    super(data);
    this.buff = data.buff;
    this.frequency = data.frequency || this.frequency;
    this.range = data.range || this.range;
    this.friendly = data.friendly || this.friendly;
  }

  readonly buff: Buff;
  readonly frequency: number = 1000;
  readonly range: number = 150;
  readonly friendly: boolean = false;

  static fromSval(sval: any): Aura {
    return new Aura({
      ...Modifier.svalKeys(sval),
      lifesteal: LoadBuff(globalRootPath, sval['buff']),
      frequency: sval['freq'],
      range: sval['range'],
      friendly: sval['friendly'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class HealthFilter extends Modifier {

  constructor(data: any) {
    super(data);
    this.below = data.below || this.below;
    this.above = data.above || this.above;
  }

  readonly below: number = -10;
  readonly above: number = 10;

  static fromSval(sval: any): HealthFilter {
    return new HealthFilter({
      ...Modifier.svalKeys(sval),
      below: sval['below'],
      above: sval['above'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class CriticalHit extends Modifier {

  constructor(data: any) {
    super(data);
    this.chance = data.chance || this.chance;
    this.spellChance = data.spellChance || this.spellChance;
  }

  readonly chance: number = 0;
  readonly spellChance: number = 0;

  static fromSval(sval: any): CriticalHit {
    return new CriticalHit({
      ...Modifier.svalKeys(sval),
      chance: sval['chance'],
      spellChance: sval['spell-chance'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Markham extends Modifier {

  constructor(data: any) {
    super(data);
    this.health = data.health || this.health;
    this.mana = data.mana || this.mana;
    this.attackPower = data.attackPower || this.attackPower;
    this.spellPower = data.spellPower || this.spellPower;
    this.armor = data.armor || this.armor;
    this.resistance = data.resistance || this.resistance;
    this.oreScale = data.oreScale || this.oreScale;
    this.goldScale = data.goldScale || this.goldScale;
    this.skillMultiplier = data.skillMultiplier || this.skillMultiplier;
  }

  readonly health: number = 0;
  readonly mana: number = 0;
  readonly attackPower: number = 0;
  readonly spellPower: number = 0;
  readonly armor: number = 0;
  readonly resistance: number = 0;
  readonly oreScale: number = 0;
  readonly goldScale: number = 0;
  readonly skillMultiplier: number = 0;

  static fromSval(sval: any): CriticalHit {
    return new CriticalHit({
      ...Modifier.svalKeys(sval),
      health: sval['health'],
      mana: sval['mana'],
      attackPower: sval['attack-power'],
      spellPower: sval['spell-power'],
      armor: sval['armor'],
      resistance: sval['resistance'],
      oreScale: sval['ore-scale'],
      goldScale: sval['gold-scale'],
      skillMultiplier: sval['skill-mul'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class GoldGain extends Modifier {

  constructor(data: any) {
    super(data);
    this.scale = data.scale || this.scale;
    this.scaleAdd = data.scaleAdd || this.scaleAdd;
  }

  readonly scale: number = 1;
  readonly scaleAdd: number = 0;

  static fromSval(sval: any): GoldGain {
    return new GoldGain({
      ...Modifier.svalKeys(sval),
      scale: sval['scale'],
      scaleAdd: sval['scale-add'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Block extends Modifier {

  constructor(data: any) {
    super(data);
    this.physical = data.physical || this.physical;
    this.magical = data.magical || this.magical;
    this.chance = data.chance || this.chance;
    this.timeout = data.timeout || this.timeout;
  }

  readonly physical: number = 0;
  readonly magical: number = 0;
  readonly chance: number = 1;
  readonly timeout: number;

  static fromSval(sval: any): Block {
    return new Block({
      ...Modifier.svalKeys(sval),
      physical: sval['physical'],
      magical: sval['magical'],
      chance: sval['chance'],
      timeout: sval['timeout'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class ManaFromDamageTaken extends Modifier {

  constructor(data: any) {
    super(data);
    this.scale = data.scale;
    this.chance = data.chance || this.chance;
  }

  readonly scale: number;
  readonly chance: number = 1;

  static fromSval(sval: any): ManaFromDamageTaken {
    return new ManaFromDamageTaken({
      ...Modifier.svalKeys(sval),
      scale: sval['scale'],
      chance: sval['chance'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class SealOfMartyr extends Modifier {

  constructor(data: any) {
    super(data);
    this.attackMultiplier = data.attackMultiplier || this.attackMultiplier;
    this.spellMultiplier = data.spellMultiplier || this.spellMultiplier;
    this.multiplier = data.multiplier || this.multiplier;
  }

  readonly attackMultiplier: number = 1;
  readonly spellMultiplier: number = 1;
  readonly multiplier: number = 1;

  static fromSval(sval: any): SealOfMartyr {
    return new SealOfMartyr({
      ...Modifier.svalKeys(sval),
      attackMultiplier: sval['attack-mul'],
      spellMultiplier: sval['spell-mul'],
      multiplier: sval['mul'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class SealOfMana extends Modifier {

  constructor(data: any) {
    super(data);
    this.attackMultiplier = data.attackMultiplier || this.attackMultiplier;
    this.spellMultiplier = data.spellMultiplier || this.spellMultiplier;
    this.multiplier = data.multiplier || this.multiplier;
  }

  readonly attackMultiplier: number = 1;
  readonly spellMultiplier: number = 1;
  readonly multiplier: number = 1;

  static fromSval(sval: any): SealOfMana {
    return new SealOfMana({
      ...Modifier.svalKeys(sval),
      attackMultiplier: sval['attack-mul'],
      spellMultiplier: sval['spell-mul'],
      multiplier: sval['mul'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class DamageModifier extends Modifier {

  constructor(data: any) {
    super(data);
    this.attackPower = data.attackPower || this.attackPower;
    this.spellPower = data.spellPower || this.spellPower;
    this.physicalAdd = data.physicalAdd || this.physicalAdd;
    this.magicalAdd = data.magicalAdd || this.magicalAdd;
    this.attackMultiplier = data.attackMultiplier || this.attackMultiplier;
    this.spellMultiplier = data.spellMultiplier || this.spellMultiplier;
    this.multiplier = data.multiplier || this.multiplier;
  }

  readonly attackPower: number = 1;
  readonly spellPower: number = 1;
  readonly physicalAdd: number = 1;
  readonly magicalAdd: number = 1;
  readonly attackMultiplier: number = 1;
  readonly spellMultiplier: number = 1;
  readonly multiplier: number = 1;

  static fromSval(sval: any): SealOfMana {
    return new SealOfMana({
      ...Modifier.svalKeys(sval),
      attackPower: sval['attack-[ower'],
      spellPower: sval['spell-power'],
      physicalAdd: sval['physical-add'],
      magicalAdd: sval['magical-add'],
      attackMultiplier: sval['attack-mul'],
      spellMultiplier: sval['spell-mul'],
      multiplier: sval['mul'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
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

const class_to_modifier = {
  'Modifiers::BlockProjectile': BlockProjectile,
  'Modifiers::TriggerEffect': TriggerEffect,
  'Modifiers::HealthGain': HealthGain,
  'Modifiers::WarlockCleaverModifier': WarlockCleaverModifier,
  'Modifiers::FlameShield': FlameShield,
  'Modifiers::CleaveRange': CleaveRange,
  'Modifiers::Combo': Combo,
  'Modifiers::StatsBase': StatsBase,
  'Modifiers::Armor': Armor,
  'Modifiers::SpellCost': SpellCost,
  'Modifiers::Lifestealing': Lifestealing,
  'Modifiers::Aura': Aura,
  'Modifiers::HealthFilter': HealthFilter,
  'Modifiers::CriticalHit': CriticalHit,
  'Modifiers::Markham': Markham,
  'Modifiers::GoldGain': GoldGain,
  'Modifiers::Block': Block,
  'Modifiers::ManaFromDamageTaken': ManaFromDamageTaken,
  'Modifiers::SealOfMartyr': SealOfMartyr,
  'Modifiers::SealOfMana': SealOfMana,
  'Modifiers::Damage': DamageModifier,
};
