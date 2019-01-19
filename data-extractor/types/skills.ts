import {LoadModifiers, Modifier} from './modifiers';
import {ClassToUnit, Unit} from './units';
import {Action, LoadActions} from './actions';
import {Buff} from './buffs';
import {Projectile} from './projectiles';
import {Effect, LoadEffects} from './effects';
import {GameState, reduceSumDamage, ResultDamage} from './game';
import {globalRootPath, LoadBuff, loadFile} from '../sval/loader';

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
      modifiers: LoadModifiers(sval)
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

  constructor(data: any) {
    super(data);
    this.durationMul = data.durationMul;
    this.unit = data.unit;
  }

  readonly durationMul: number = 1;
  readonly unit: Unit;

  static fromSval(sval: any): ScorchedEarth {
    return new ScorchedEarth({
      ...SkillLevel.svalKeys(sval),
      durationMul: sval['duration-mul'],
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

export class Shatter extends SkillLevel {

  constructor(data: any) {
    super(data);
    this.chance = data.chance || this.chance;
    this.trigger = data.trigger || this.trigger;
    this.requiredHp = data.requiredHp || this.requiredHp;
    this.actions = data.actions;
  }

  readonly chance: number = 0.5;
  readonly trigger: string = 'kill';
  readonly requiredHp: number = 1;
  readonly actions: Action[];

  static fromSval(sval: any): Shatter {
    return new Shatter({
      ...SkillLevel.svalKeys(sval),
      chance: sval['chance'],
      trigger: sval['trigger'],
      requiredHp: sval['required-hp'],
      actions: LoadActions(sval)
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Stormlash extends SkillLevel {

  constructor(data: any) {
    super(data);
    this.chance = data.chance;
    this.intensity = data.intensity;
  }

  readonly chance: number = 1;
  readonly intensity: number = 0.5;

  static fromSval(sval: any): Stormlash {
    return new Stormlash({
      ...SkillLevel.svalKeys(sval),
      chance: sval['chance'],
      intensity: sval['intensity']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class TwinnedArrow extends SkillLevel {

  constructor(data: any) {
    super(data);
    this.chance = data.chance;
  }

  readonly chance: number = 0.1;

  static fromSval(sval: any): TwinnedArrow {
    return new TwinnedArrow({
      ...SkillLevel.svalKeys(sval),
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

export class CelestialOrbs extends SkillLevel {

  constructor(data: any) {
    super(data);
    this.numOrbs = data.numOrbs;
    this.effectInterval = data.effectInterval;
    this.effects = data.effects;
  }

  readonly numOrbs: number;
  readonly effectInterval: number;
  readonly effects: Effect[];

  static fromSval(sval: any): CelestialOrbs {
    return new CelestialOrbs({
      ...SkillLevel.svalKeys(sval),
      numOrbs: sval['num-orbs'],
      effectInterval: sval['effect-interval'],
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

export class ManaShield extends SkillLevel {

  constructor(data: any) {
    super(data);
    this.shieldDistr = data.shieldDistr || this.shieldDistr;
    this.shieldDamagePerMana = data.shieldDamagePerMana || this.shieldDamagePerMana;
  }

  readonly shieldDistr: number;
  readonly shieldDamagePerMana: number;

  static fromSval(sval: any): ManaShield {
    return new ManaShield({
      ...SkillLevel.svalKeys(sval),
      shieldDistr: sval['shield-distr'],
      shieldDamagePerMana: sval['shield-dmg-per-mana']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class ExtendedDomain extends SkillLevel {

  constructor(data: any) {
    super(data);
    this.rangeMultiplier = data.rangeMultiplier || this.rangeMultiplier;
    this.modifiers = data.modifiers;
  }

  readonly rangeMultiplier: number = 1;
  readonly modifiers: Modifier[];

  static fromSval(sval: any): ExtendedDomain {
    return new ExtendedDomain({
      ...SkillLevel.svalKeys(sval),
      rangeMultiplier: sval['range-mul'],
      modifiers: LoadModifiers(sval)
    });
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

  constructor(data: any) {
    super(data);
    this.chargeMax = data.chargeMax || this.chargeMax;
    this.holdFrame = data.holdFrame || this.holdFrame;
    this.unit = data.unit;
  }

  readonly chargeMax: number = 2000;
  readonly holdFrame: number = -1;
  readonly unit: Unit;

  static fromSval(sval: any): ChargeUnit {
    return new ChargeUnit({
      ...ActiveSkill.svalKeys(sval),
      chargeMax: sval['charge-max'],
      holdFrame: sval['hold-frame'],
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

export class DropEffect extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.selfDamage = data.selfDamage || this.selfDamage;
    this.teamDamage = data.teamDamage || this.teamDamage;
    this.enemyDamage = data.enemyDamage || this.enemyDamage;
    this.effects = data.effects;
  }

  readonly selfDamage: number = 0;
  readonly teamDamage: number = 0;
  readonly enemyDamage: number = 0;
  readonly effects: Effect[];

  static fromSval(sval: any): DropEffect {
    return new DropEffect({
      ...ActiveSkill.svalKeys(sval),
      selfDamage: sval['self-dmg'],
      teamDamage: sval['team-dmg'],
      enemyDamage: sval['enemy-dmg'],
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

export class DropUnit extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.unit = data.unit;
    this.maxCount = data.maxCount;
  }

  readonly unit: Unit;
  readonly maxCount: number;

  static fromSval(sval: any): DropUnit {
    return new DropUnit({
      ...ActiveSkill.svalKeys(sval),
      unit: ClassToUnit(loadFile(globalRootPath, sval['unit'])[0]),
      maxCount: sval['max-count']
    });
  }

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
      ...ActiveSkill.svalKeys(sval),
      effects: LoadEffects(sval)
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return this.effects.map(effect => effect.calculateDamage(state)).reduce(reduceSumDamage);
  }
}

export class ShootProjectile extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.projectile = data.projectile;
    this.projectiles = data.projectiles || this.projectiles;
  }

  readonly projectile: Projectile;
  readonly projectiles: number = 1;

  static fromSval(sval: any): ShootProjectile {
    return new ShootProjectile({
      ...ShootProjectile.svalKeys(sval)
    });
  }

  static svalKeys(sval: any): any {
    return {
      ...ActiveSkill.svalKeys(sval),
      projectile: ClassToUnit(loadFile(globalRootPath, sval['projectile'])[0]),
      projectiles: sval['projectiles']
    };
  }

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
      actions: LoadActions(sval)
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

  constructor(data: any) {
    super(data);
    this.projectile = data.projectile;
    this.projectiles = data.projectiles || this.projectiles;
    this.interval = data.interval || this.interval;
    this.spewInterval = data.spewInterval || this.spewInterval;
    this.effectInterval = data.effectInterval || this.effectInterval;
    this.effects = data.effects;
  }

  readonly projectile: Projectile;
  readonly projectiles: number = 1;
  readonly interval: number = 100;
  readonly spewInterval: number = 30;
  readonly effectInterval: number = 1000;
  readonly effects: Effect[];

  static fromSval(sval: any): SpewProjectiles {
    return new SpewProjectiles({
      ...ActiveSkill.svalKeys(sval),
      projectile: ClassToUnit(loadFile(globalRootPath, sval['projectile'])[0]),
      projectiles: sval['projectiles'],
      interval: sval['interval'],
      spewInterval: sval['spew-interval'],
      effectInterval: sval['effect-interval'],
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

export class StaggeredSpawnUnits extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.unit = data.unit;
    this.count = data.count;
  }

  readonly unit: Unit;
  readonly count: number;

  static fromSval(sval: any): StaggeredSpawnUnits {
    return new StaggeredSpawnUnits({
      ...ActiveSkill.svalKeys(sval),
      unit: ClassToUnit(loadFile(globalRootPath, sval['unit'])[0]),
      count: sval['positions'].length
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class TempBuffAoe extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.buff = data.buff;
    this.buffTeam = data.buffTeam;
    this.interval = data.interval;
    this.activeTime = data.activeTime;
    this.modifiers = data.modifiers || this.modifiers;
  }

  readonly buff: Buff;
  readonly buffTeam: Buff;
  readonly interval: number;
  readonly activeTime: number;
  readonly modifiers: Modifier[] = [];

  static fromSval(sval: any): TempBuffAoe {
    return new TempBuffAoe({
      ...ActiveSkill.svalKeys(sval),
      buff: LoadBuff(globalRootPath, sval['buff']),
      buffTeam: LoadBuff(globalRootPath, sval['buff-team']),
      interval: sval['interval'],
      activeTime: sval['active-time'],
      modifiers: sval['modifiers']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class Whirlnova extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.duration = data.duration;
    this.projDelay = data.projDelay || this.projDelay;
    this.perRevolution = data.perRevolution || this.perRevolution;
  }

  readonly duration: number;
  readonly projDelay: number = 33;
  readonly perRevolution: number = 16;

  static svalKeys(sval: any): any {
    return {
      ...ActiveSkill.svalKeys(sval),
      duration: sval['duration'],
      projDelay: sval['proj-delay'],
      perRevolution: sval['per-revolution']
    };
  }

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

export class ShootBeam extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.effects = data.effects;
    this.teamEffects = data.teamEffects;
    this.interval = data.interval || this.interval;
    this.buildupTime = data.buildupTime || this.buildupTime;
  }

  readonly effects: Effect[];
  readonly teamEffects: Effect[];
  readonly interval: number = 100;
  readonly buildupTime: number = 1000;

  static fromSval(sval: any): ShootBeam {
    return new ShootBeam({
      ...ActiveSkill.svalKeys(sval),
      effects: LoadEffects(sval),
      teamEffects: LoadEffects(sval, 'team-'),
      interval: sval['interval'],
      buildupTime: sval['buildup-time']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class GrappleHook extends ActiveSkill {

  constructor(data: any) {
    super(data);
    this.effects = data.effects;
    this.hitEffects = data.hitEffects;
    this.speed = data.speed || this.speed;
    this.range = data.buildupTime || this.range;
  }

  readonly effects: Effect[];
  readonly hitEffects: Effect[];
  readonly speed: number = 3;
  readonly range: number = 10;

  static fromSval(sval: any): GrappleHook {
    return new GrappleHook({
      ...ActiveSkill.svalKeys(sval),
      effects: LoadEffects(sval),
      hitEffects: LoadEffects(sval, 'hit-'),
      speed: sval['speed'],
      range: sval['range']
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

  constructor(data: any) {
    super(data);
  }

  static fromSval(sval: any): ShootProjectileFan {
    return new ShootProjectileFan({
      ...ShootProjectile.svalKeys(sval),
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class ArrowFlurry extends Whirlnova {

  constructor(data: any) {
    super(data);
  }

  static fromSval(sval: any): ArrowFlurry {
    return new ArrowFlurry({
      ...Whirlnova.svalKeys(sval)
    });
  }

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

export class StackProtection extends StackSkill {

  constructor(data: any) {
    super(data);
    this.damageTakenMultiplier = data.damageTakenMultiplier;
  }

  readonly damageTakenMultiplier: number = 0;

  static fromSval(sval: any): StackProtection {
    return new StackProtection({
      ...StackSkill.svalKeys(sval),
      damageTakenMultiplier: sval['dmg-taken-mul']
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }
}

export class StackEvasion extends StackSkill {

  constructor(data: any) {
    super(data);
    this.recharge = data.recharge || this.recharge;
    this.chance = data.chance || this.chance;
  }

  readonly recharge: number = 1000;
  readonly chance: number = 1;

  static fromSval(sval: any): StackEvasion {
    return new StackEvasion({
      ...StackSkill.svalKeys(sval),
      recharge: sval['recharge'],
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

export class Fervor extends StackSkill {

  constructor(data: any) {
    super(data);
    this.stackSpeed = data.stackSpeed;
    this.stackEvasion = data.stackEvasion || this.stackEvasion;
  }

  readonly stackSpeed: number;
  readonly stackEvasion: number = 0;

  static fromSval(sval: any): Fervor {
    return new Fervor({
      ...StackSkill.svalKeys(sval),
      stackSpeed: sval['stack-speed'],
      stackEvasion: sval['stack-evasion']
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
  'Skills::ShootBeam': ShootBeam,
  'Skills::ManaShield': ManaShield,
  'Skills::StackProtection': StackProtection,
  'Skills::GrappleHook': GrappleHook,
  'Skills::StackEvasion': StackEvasion,
  'Skills::Fervor': Fervor,
  'Skills::ExtendedDomain': ExtendedDomain,
};
