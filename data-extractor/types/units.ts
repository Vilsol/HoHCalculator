import {GameState, ResultDamage} from './game';
import {Effect, LoadEffects} from './effects';
import {Action, LoadActions} from './actions';
import {globalRootPath, loadFile} from '../sval/loader';

export abstract class Unit {

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

export abstract class BaseProjectile {

  protected constructor(data: any) {
    this.class = data.class;
    this.penetrating = data.penetrating || this.penetrating;
    this.seeking = data.seeking || this.seeking;
    this.seekingTurnspeed = data.seekingTurnspeed || this.seekingTurnspeed;
    this.speed = data.speed || this.speed;
    this.speedDelta = data.speedDelta || this.speedDelta;
    this.speedDeltaMax = data.speedDeltaMax || this.speedDeltaMax;
    this.blockable = data.blockable || this.blockable;
    this.effectParams = data.effectParams || this.effectParams;
  }

  readonly class: string;
  readonly penetrating: boolean = false;
  readonly seeking: boolean = false;
  readonly seekingTurnspeed: number = 0.07;
  readonly speed: number = 0;
  readonly speedDelta: number = 0;
  readonly speedDeltaMax: number = 0;
  readonly blockable: boolean = false;
  readonly effectParams: any;

  static svalKeys(sval: any): any {
    return {
      class: sval.class,
      penetrating: sval['penetrating'],
      seeking: sval['seeking'],
      seekingTurnspeed: sval['seeking-turnspeed'],
      speed: sval['speed'],
      speedDelta: sval['speed-delta'],
      speedDeltaMax: sval['speed-delta-max'],
      blockable: sval['blockable'],
      effectParams: sval['effect-params'],
    };
  }

  abstract calculateDamage(state: GameState): ResultDamage;

}

export class Projectile extends BaseProjectile {

  constructor(data: any) {
    super(data);
    this.ttl = data.ttl || this.ttl;
    this.range = data.range || this.range;
    this.selfDamage = data.selfDamage || this.selfDamage;
    this.teamDamage = data.teamDamage || this.teamDamage;
  }

  readonly ttl: number = 5000;
  readonly range: number = -1;
  readonly selfDamage: number = 0;
  readonly teamDamage: number = 0;
  readonly effects: Effect[];

  static fromSval(sval: any): Projectile {
    return new Projectile({
      ...BaseProjectile.svalKeys(sval),
      ttl: sval['ttl'],
      range: sval['range'],
      selfDamage: sval['self-dmg'],
      teamDamage: sval['team-dmg'],
      effects: LoadEffects(sval),
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class RayProjectile extends BaseProjectile {

  constructor(data: any) {
    super(data);
    this.effects = data.effects;
    this.selfDamage = data.selfDamage || this.selfDamage;
    this.teamDamage = data.teamDamage || this.teamDamage;
    this.bounces = data.selfDabouncesage || this.bounces;
    this.penetrationIntensityMultiplier = data.penetrationIntensityMultiplier || this.penetrationIntensityMultiplier;
    this.penetrateAll = data.penetrateAll || this.penetrateAll;
  }

  readonly effects: Effect[];
  readonly selfDamage: number = 0;
  readonly teamDamage: number = 0;
  readonly bounces: number = 0;
  readonly penetrationIntensityMultiplier: number = 1;
  readonly penetrateAll: boolean = false;

  static fromSval(sval: any): RayProjectile {
    return new RayProjectile({
      ...RayProjectile.svalKeys(sval)
    });
  }

  static svalKeys(sval: any): any {
    return {
      ...BaseProjectile.svalKeys(sval),
      effects: LoadEffects(sval),
      selfDamage: sval['self-dmg'],
      teamDamage: sval['team-dmg'],
      bounces: sval['bounces'],
      penetrationIntensityMultiplier: sval['penetration-intensity-mul'],
      penetrateAll: sval['penetrate-all'],
    };
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class PowershotProjectile extends RayProjectile {

  constructor(data: any) {
    super(data);
    this.speedMin = data.speedMin;
    this.speedMax = data.speedMax;
    this.penetrationMin = data.penetrationMin;
    this.penetrationMax = data.penetrationMax;
    this.rangeMin = data.rangeMin;
    this.rangeMax = data.rangeMax;
    this.effectIntensityMin = data.effectIntensityMin;
    this.effectIntensityMax = data.effectIntensityMax;
  }

  readonly speedMin: number;
  readonly speedMax: number;
  readonly penetrationMin: number;
  readonly penetrationMax: number;
  readonly rangeMin: number;
  readonly rangeMax: number;
  readonly effectIntensityMin: number;
  readonly effectIntensityMax: number;

  static fromSval(sval: any): PowershotProjectile {
    return new PowershotProjectile({
      ...RayProjectile.svalKeys(sval),
      speedMin: sval['speed-min'],
      speedMax: sval['speed-max'],
      penetrationMin: sval['penetration-min'],
      penetrationMax: sval['penetration-max'],
      rangeMin: sval['range-min'],
      rangeMax: sval['range-max'],
      effectIntensityMin: sval['effect-intensity-min'],
      effectIntensityMax: sval['effect-intensity-max'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class RangerProjectile extends RayProjectile {

  constructor(data: any) {
    super(data);
  }

  static fromSval(sval: any): RangerProjectile {
    return new RangerProjectile({
      ...RayProjectile.svalKeys(sval),
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class SorcererProjectile extends RayProjectile {

  constructor(data: any) {
    super(data);
    this.speedTtlAdd = data.speedTtlAdd || this.speedTtlAdd;
  }

  readonly speedTtlAdd: number = 0;

  static fromSval(sval: any): SorcererProjectile {
    return new SorcererProjectile({
      ...RayProjectile.svalKeys(sval),
      speedTtlAdd: sval['speed-ttl-add'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class SorcererOrbProjectile extends RayProjectile {

  constructor(data: any) {
    super(data);
    this.delay = data.delay || this.delay;
    this.projectileDelay = data.projectileDelay || this.projectileDelay;
  }

  readonly delay: number = 500;
  readonly projectileDelay: number = 40;

  static fromSval(sval: any): SorcererOrbProjectile {
    return new SorcererOrbProjectile({
      ...RayProjectile.svalKeys(sval),
      delay: sval['delay'],
      projectileDelay: sval['projectile-delay'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class BoltShooter extends Unit {

  constructor(data: any) {
    super(data);
    this.ttl = data.ttl;
    this.bolts = data.bolts;
    // TODO Fix
    this.useStormlash = data.useStormlash || this.useStormlash;
    this.consecutiveMultiplier = data.consecutiveMultiplier || this.consecutiveMultiplier;
    this.effects = data.effects;
    this.linkEffects = data.linkEffects;
  }

  readonly ttl: number = 2000;
  readonly bolts: number = 5;
  readonly useStormlash: boolean = true;
  readonly consecutiveMultiplier: number = 1;
  readonly effects: Effect[];
  readonly linkEffects: Effect[];

  static fromSval(sval: any): BoltShooter {
    return new BoltShooter({
      ...Unit.svalKeys(sval),
      ttl: sval['ttl'],
      bolts: sval['bolts'],
      useStormlash: sval['use-stormlash'],
      consecutiveMultiplier: sval['consecutive-mul'],
      effects: LoadEffects(sval),
      linkEffects: LoadEffects(sval, 'link-'),
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class BombBehavior extends Unit {

  constructor(data: any) {
    super(data);
    this.team = data.team || this.team;
    this.delay = data.delay || this.delay;
    this.delayRandom = data.delayRandom || this.delayRandom;
    this.actions = data.actions;
  }

  readonly team: string = 'enemy';
  readonly delay: number = 5;
  readonly delayRandom: boolean = true;
  readonly actions: Action[];

  static fromSval(sval: any): BombBehavior {
    return new BombBehavior({
      ...Unit.svalKeys(sval),
      team: sval['team'],
      delay: sval['delay'],
      delayRandom: sval['delay-random'],
      consecutiveMultiplier: sval['consecutive-mul'],
      actions: LoadActions(sval),
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class DangerAreaBehavior extends Unit {

  constructor(data: any) {
    super(data);
    this.frequency = data.frequency || this.frequency;
    this.actorFilter = data.actorFilter || this.actorFilter;
    this.ttl = data.ttl || this.ttl;
    this.selfDamage = data.selfDamage || this.selfDamage;
    this.teamDamage = data.teamDamage || this.teamDamage;
    this.effects = data.effects;
  }

  readonly frequency: number = 500;
  readonly actorFilter: number = 71;
  readonly ttl: number = 1000;
  readonly selfDamage: number = 0;
  readonly teamDamage: number = 0;
  readonly effects: Effect[];

  static fromSval(sval: any): DangerAreaBehavior {
    return new DangerAreaBehavior({
      ...Unit.svalKeys(sval),
      frequency: sval['frequency'],
      actorFilter: sval['actor-filter'],
      ttl: sval['ttl'],
      selfDamage: sval['self-dmg'],
      teamDamage: sval['team-dmg'],
      effects: LoadEffects(sval),
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class PriestGroundCircle extends Unit {

  constructor(data: any) {
    super(data);
    this.interval = data.interval;
    this.damage = data.damage;
    this.ttl = data.ttl;
    this.healScale = data.healScale;
  }

  readonly interval: number;
  readonly damage: number;
  readonly ttl: number;
  readonly healScale: number;

  static fromSval(sval: any): PriestGroundCircle {
    return new PriestGroundCircle({
      ...Unit.svalKeys(sval),
      interval: sval['interval'],
      damage: sval['damage'],
      ttl: sval['ttl'],
      healScale: sval['heal-scale'],
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export class GargoyleSpawner extends Unit {

  constructor(data: any) {
    super(data);
    this.delay = data.delay;
    this.unitBolt = data.unitBolt;
    this.unitArea = data.unitArea;
  }

  readonly delay: number;
  readonly unitBolt: Unit;
  readonly unitArea: Unit;

  static fromSval(sval: any): GargoyleSpawner {
    return new GargoyleSpawner({
      ...Unit.svalKeys(sval),
      delay: sval['delay'],
      unitBolt: ClassToUnit(loadFile(globalRootPath, sval['unit-bolt'])[0]),
      unitArea: ClassToUnit(loadFile(globalRootPath, sval['unit-area'])[0]),
    });
  }

  calculateDamage(state: GameState): ResultDamage {
    return {
      physical: 0,
      magical: 0
    };
  }

}

export function ClassToUnit(sval: any): Unit {
  if (class_to_unit[sval['class']]) {
    if (class_to_unit[sval['class']]['fromSval']) {
      return class_to_unit[sval['class']]['fromSval'](sval);
    } else {
      throw new Error('Invalid unit config: ' + sval['class']);
    }
  }

  throw new Error('Unit not found: ' + sval['class']);
}

const class_to_unit = {
  'PowershotProjectile': PowershotProjectile,
  'RangerProjectile': RangerProjectile,
  'SorcererProjectile': SorcererProjectile,
  'SorcererOrbProjectile': SorcererOrbProjectile,
  'RayProjectile': RayProjectile,
  'Projectile': Projectile,
  'BoltShooter': BoltShooter,
  'BombBehavior': BombBehavior,
  'DangerAreaBehavior': DangerAreaBehavior,
  'PriestGroundCircle': PriestGroundCircle,
  'GargoyleSpawner': GargoyleSpawner,
};
