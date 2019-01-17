import {Modifier} from './modifiers';
import {Unit} from './units';
import {Action} from './actions';
import {Buff} from './buffs';
import {Projectile} from './projectiles';
import {Effect, LoadEffects} from './effects';
import {GameState, reduceSumDamage, ResultDamage} from './game';

export class Skill {

  constructor(data: any) {
    this.name = data.name;
    this.levels = data.levels;
  }

  readonly name: string;
  readonly levels: SkillLevel[];

  static fromSval(sval: any): Skill {
    return new Skill({
      name: sval['name'],
      levels: sval['skills'].map(skill => ClassToSkill(skill))
    });
  }

  calculateDamage(level: number, state: GameState): ResultDamage {
    return this.levels[level].calculateDamage(state);
  }

}

export abstract class SkillLevel {

  constructor(data: any) {
    this.class = data.class;
  }

  readonly class: string;

  static svalKeys(sval: any): any {
    return {
      class: sval['class']
    };
  }

  abstract calculateDamage(state: GameState): ResultDamage;

}

export abstract class ActiveSkill extends SkillLevel {

  constructor(data: any) {
    super(data);
    this.cooldown = data.cooldown || this.cooldown;
    this.manaCost = data.manaCost || this.manaCost;
    this.staminaCost = data.staminaCost || this.staminaCost;
    this.healthCost = data.healthCost || this.healthCost;
    this.blocking = data.blocking || this.blocking;
  }

  readonly cooldown: number = 1000;
  readonly manaCost: number = 0;
  readonly staminaCost: number = 0;
  readonly healthCost: number = 0;
  readonly blocking: boolean = false;

  static svalKeys(sval: any): any {
    return {
      ...SkillLevel.svalKeys(sval),
      cooldown: sval['cooldown'],
      manaCost: sval['mana-cost'],
      staminaCost: sval['stamina-cost'],
      healthCost: sval['health-cost'],
      blocking: sval['blocking']
    };
  }

}

export class Juggernaut extends SkillLevel {
  cooldown: number;
  effects: Effect[];

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class PassiveSkill extends SkillLevel {

  constructor(data: any) {
    super(data);
    this.modifiers = data.modifiers || this.modifiers;
  }

  readonly modifiers: Modifier[] = [];

  static fromSval(sval: any): PassiveSkill {
    return new PassiveSkill({
      ...SkillLevel.svalKeys(sval),
      modifiers: sval['modifiers'] // TODO Convert
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class ScorchedEarth extends SkillLevel {
  'duration-mul': number;
  units: Unit[];

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Shatter extends SkillLevel {
  chance: number;
  actions: Action[];

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Stormlash extends SkillLevel {
  chance: number;
  intensity: number;

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class TwinnedArrow extends SkillLevel {
  chance: number;

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class CelestialOrbs extends SkillLevel {
  'num-orbs': number;
  'effect-interval': number;
  effects: Effect[];

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class StackSkill extends SkillLevel {

  constructor(data: any) {
    super(data);
    this.maxStacks = data.maxStacks || this.maxStacks;
  }

  readonly maxStacks: number = 0;

  static svalKeys(sval: any): StackSkill {
    return {
      ...SkillLevel.svalKeys(sval),
      maxStacks: sval['max-stacks']
    };
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class BuffAoe extends ActiveSkill {
  'active-time': number;
  buff: string;
  interval: number;
  modifiers: Modifier[];

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Charge extends ActiveSkill {

  constructor(data: any) {
    super(data);
  }

  static fromSval(sval: any): Charge {
    return new Charge({
      ...ActiveSkill.svalKeys(sval)
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class ChargeUnit extends ActiveSkill {
  'charge-max': number;
  'hold-frame': number;
  units: Unit[];

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class DropEffect extends ActiveSkill {
  'enemy-dmg': number;
  effects: Effect[];

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class DropUnit extends ActiveSkill {
  units: Unit[];
  'max-count': number;

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Explode extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.effects = data.effects || this.effects;
    this.selfEffects = data.selfEffects || this.selfEffects;
  }

  readonly effects: Effect[] = [];
  readonly selfEffects: Effect[] = [];

  static fromSval(sval: any): Explode {
    return new Explode({
      ...ActiveSkill.svalKeys(sval),
      effects: LoadEffects(sval),
      selfEffects: LoadEffects(sval, 'self-')
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class MeleeSwing extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.effects = data.effects;
  }

  readonly effects: Effect[];

  static fromSval(sval: any): MeleeSwing {
    return new MeleeSwing({
      class: sval['class'],
      effects: LoadEffects(sval)
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return this.effects.map(effect => effect.calculateDamage(state)).reduce(reduceSumDamage);
  }
}

export class ShootProjectile extends ActiveSkill {
  projectile: Projectile;
  projectiles: number;

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class ShootRay extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.actions = data.actions || this.actions;
  }

  readonly actions: Action[] = [];

  static fromSval(sval: any): ShootRay {
    return new ShootRay({
      ...ActiveSkill.svalKeys(sval),
      actions: sval['actions'] // TODO Convert
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class SpawnUnit extends ActiveSkill {
  unit: Unit;

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class SpewProjectiles extends ActiveSkill {
  projectile: Projectile;
  projectiles: number;
  interval: number;
  'spew-interval': number;
  'effect-interval': number;
  effects: Effect[];

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class StaggeredSpawnUnits extends ActiveSkill {
  unit: Unit;
  count: number;

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class TempBuffAoe extends ActiveSkill {
  buff: Buff;
  'buff-team': Buff;
  interval: number;
  'active-time': number;
  modifiers: Modifier[];

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Whirlnova extends ActiveSkill {
  duration: number;
  'proj-delay': number;

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Whirlwind extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.effects = data.effects || this.effects;
    this.duration = data.duration || this.duration;
    this.frequency = data.effects || this.frequency;
  }

  readonly effects: Effect[];
  readonly duration: number;
  readonly frequency: number;

  static fromSval(sval: any): Whirlwind {
    return new Whirlwind({
      ...ActiveSkill.svalKeys(sval),
      effects: LoadEffects(sval),
      duration: sval['duration'],
      frequency: sval['frequency']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class DropUnitWarlock extends DropUnit {
  // Nothing Special

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class ShootProjectileFan extends ShootProjectile {
  // Nothing Special

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class ArrowFlurry extends Whirlnova {
  // Nothing Special

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class StackDamage extends StackSkill {

  constructor(data: any) {
    super(data);
    this.magicDamage = data.magicDamage || this.magicDamage;
  }

  readonly magicDamage: number = 0;

  static fromSval(sval: any): StackDamage {
    return new StackDamage({
      ...StackSkill.svalKeys(sval),
      magicDamage: sval['magic-damage']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

function ClassToSkill(sval: any): Skill {
  if (class_to_skill[sval['class']]) {
    if (class_to_skill[sval['class']]['fromSval']) {
      return class_to_skill[sval['class']]['fromSval'](sval);
    } else {
      throw new Error('Invalid skill config: ' + sval['class']);
    }
  }

  throw new Error('Skill not found: ' + sval['class']);
}

const class_to_skill = {
  'Skills::Juggernaut': Juggernaut,
  'Skills::PassiveSkill': PassiveSkill,
  'Skills::ScorchedEarth': ScorchedEarth,
  'Skills::Shatter': Shatter,
  'Skills::Stormlash': Stormlash,
  'Skills::TwinnedArrow': TwinnedArrow,
  'Skills::CelestialOrbs': CelestialOrbs,
  'Skills::BuffAoe': BuffAoe,
  'Skills::Charge': Charge,
  'Skills::ChargeUnit': ChargeUnit,
  'Skills::DropEffect': DropEffect,
  'Skills::DropUnit': DropUnit,
  'Skills::Explode': Explode,
  'Skills::MeleeSwing': MeleeSwing,
  'Skills::ShootProjectile': ShootProjectile,
  'Skills::ShootRay': ShootRay,
  'Skills::SpawnUnit': SpawnUnit,
  'Skills::SpewProjectiles': SpewProjectiles,
  'Skills::StaggeredSpawnUnits': StaggeredSpawnUnits,
  'Skills::TempBuffAoe': TempBuffAoe,
  'Skills::Whirlnova': Whirlnova,
  'Skills::Whirlwind': Whirlwind,
  'Skills::DropUnitWarlock': DropUnitWarlock,
  'Skills::ShootProjectileFan': ShootProjectileFan,
  'Skills::ArrowFlurry': ArrowFlurry,
  'Skills::StackSkill': StackSkill,
  'Skills::StackDamage': StackDamage,
};
