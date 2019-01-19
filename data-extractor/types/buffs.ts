import {Effect, LoadEffects} from './effects';
import {LoadModifiers, Modifier} from './modifiers';

export class Buff {

  constructor(data: any) {
    this.duration = data.duration || this.duration;
    this.debuff = data.debuff || this.debuff;
    this.speedMultiplier = data.speedMultiplier || this.speedMultiplier;
    this.speedDashMultiplier = data.speedDashMultiplier || this.speedDashMultiplier;
    this.damageMultiplier = data.damageMultiplier || this.damageMultiplier;
    this.damageTakenMultiplier = data.damageTakenMultiplier || this.damageTakenMultiplier;
    this.experienceMultiplier = data.experienceMultiplier || this.experienceMultiplier;
    this.armorMultiplier = data.armorMultiplier || this.armorMultiplier;
    this.resistanceMultiplier = data.resistanceMultiplier || this.resistanceMultiplier;
    this.minimumSpeed = data.minimumSpeed || this.minimumSpeed;
    this.receiveCritChance = data.receiveCritChance || this.receiveCritChance;
    this.freeMana = data.freeMana || this.freeMana;
    this.disarm = data.disarm || this.disarm;
    this.confuse = data.confuse || this.confuse;
    this.antiConfuse = data.antiConfuse || this.antiConfuse;
    this.drifting = data.drifting || this.drifting;
    this.infiniteDodge = data.infiniteDodge || this.infiniteDodge;
    this.buffDamageType = data.buffDamageType || this.buffDamageType;
    this.tick = data.tick;
    this.move = data.move;
    this.dieEffects = data.dieEffects;
    this.modifiers = data.modifiers;
    this.cleave = data.cleave;
    this.darkness = data.darkness || this.darkness;
    this.shatterable = data.shatterable || this.shatterable;
    this.windScale = data.windScale || this.windScale;
  }

  readonly duration: number = 1000;
  readonly debuff: boolean = false;
  readonly speedMultiplier: number = 1;
  readonly speedDashMultiplier: number = 1;
  readonly damageMultiplier: number = 1;
  readonly damageTakenMultiplier: number = 1;
  readonly experienceMultiplier: number = 1;
  readonly armorMultiplier: number = 1;
  readonly resistanceMultiplier: number = 1;
  readonly minimumSpeed: number = 0;
  readonly receiveCritChance: number = 0;
  readonly freeMana: boolean = false;
  readonly disarm: boolean = false;
  readonly confuse: boolean = false;
  readonly antiConfuse: boolean = false;
  readonly drifting: boolean = false;
  readonly infiniteDodge: boolean = false;
  readonly buffDamageType: number = 0;
  readonly tick?: Tick;
  readonly move?: Move;
  readonly dieEffects: Effect[];
  readonly modifiers: Modifier[];
  readonly cleave: any; // TODO Convert
  readonly darkness: boolean = false;
  readonly shatterable: boolean = false;
  readonly windScale: number = 1;

  static fromSval(sval: any): Buff {
    return new Buff({
      duration: sval['duration'],
      debuff: sval['debuff'],
      speedMultiplier: sval['speed-mul'],
      speedDashMultiplier: sval['speed-dash-mul'],
      damageMultiplier: sval['dmg-mul'],
      damageTakenMultiplier: sval['dmg-taken-mul'],
      experienceMultiplier: sval['experience-mul'],
      armorMultiplier: sval['armor-mul'],
      resistanceMultiplier: sval['resistance-mul'],
      minimumSpeed: sval['min-speed'],
      receiveCritChance: sval['receive-crit-chance'],
      freeMana: sval['free-mana'],
      disarm: sval['disarm'],
      confuse: sval['confuse'],
      antiConfuse: sval['anti-confuse'],
      drifting: sval['drifting'],
      infiniteDodge: sval['inf-dodge'],
      buffDamageType: sval['buff-dmg-type'],
      tick: Tick.fromSval(sval['tick']),
      move: Move.fromSval(sval['move']),
      dieEffects: LoadEffects(sval, 'die-'),
      modifiers: LoadModifiers(sval),
      cleave: sval['cleave'], // TODO Convert
      darkness: sval['darkness'],
      shatterable: sval['shatterable'],
      windScale: sval['wind-scale'],
    });
  }

  // TODO Apply to player function

}

class Tick {

  constructor(data: any) {
    this.frequency = data.frequency || this.frequency;
    this.effects = data.effects;
    this.immediate = data.immediate || this.immediate;
    this.onReapply = data.onReapply || this.onReapply;
  }

  readonly frequency: number = 0;
  readonly effects: Effect[];
  readonly immediate: boolean = false;
  readonly onReapply: boolean = false;

  static fromSval(sval: any): Tick {
    return sval ? new Tick({
      frequency: sval['freq'],
      effects: LoadEffects(sval),
      immediate: sval['immediate'],
      onReapply: sval['on-reapply'],
    }) : undefined;
  }

}

class Move {

  constructor(data: any) {
    this.frequency = data.frequency || this.frequency;
    this.effects = data.effects;
  }

  readonly frequency: number = 0;
  readonly effects: Effect[];

  static fromSval(sval: any): Move {
    return sval ? new Move({
      frequency: sval['freq'],
      effects: LoadEffects(sval),
    }) : undefined;
  }

}
