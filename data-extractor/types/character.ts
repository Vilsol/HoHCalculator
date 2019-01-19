import {Skill} from './skills';
import {globalRootPath, loadFile} from '../sval/loader';

export class Character {

  constructor(data: any) {
    this.skills = data.skills;
    this.baseHealth = data.baseHealth;
    this.baseMana = data.baseMana;
    this.baseHealthRegen = data.baseHealthRegen;
    this.baseManaRegen = data.baseManaRegen;
    this.baseArmor = data.baseArmor;
    this.baseResistance = data.baseResistance;
    this.levelHealth = data.levelHealth;
    this.levelMana = data.levelMana;
    this.levelHealthRegen = data.levelHealthRegen;
    this.levelManaRegen = data.levelManaRegen;
    this.levelArmor = data.levelArmor;
    this.levelResistance = data.levelResistance;
  }

  skills: Skill[];
  baseHealth: number;
  baseMana: number;
  baseHealthRegen: number;
  baseManaRegen: number;
  baseArmor: number;
  baseResistance: number;
  levelHealth: number;
  levelMana: number;
  levelHealthRegen: number;
  levelManaRegen: number;
  levelArmor: number;
  levelResistance: number;

  static fromSval(sval: any): Character {
    return new Character({
      skills: sval['skills'].map(skill => Skill.fromSval(loadFile(globalRootPath, skill)[0])),
      baseHealth: sval['base-health'],
      baseMana: sval['base-mana'],
      baseHealthRegen: sval['base-health-regen'],
      baseManaRegen: sval['base-mana-regen'],
      baseArmor: sval['base-armor'],
      baseResistance: sval['base-resistance'],
      levelHealth: sval['level-health'],
      levelMana: sval['level-mana'],
      levelHealthRegen: sval['level-health-regen'],
      levelManaRegen: sval['level-mana-regen'],
      levelArmor: sval['level-armor'],
      levelResistance: sval['level-resistance'],
    });
  }
}
