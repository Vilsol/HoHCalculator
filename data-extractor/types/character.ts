import {Skill} from './skills';

export interface Character {
  skills: Skill[];
  'base-health': number;
  'base-mana': number;
  'base-health-regen': number;
  'base-mana-regen': number;
  'base-armor': number;
  'base-resistance': number;
  'level-health': number;
  'level-mana': number;
  'level-health-regen': number;
  'level-mana-regen': number;
  'level-armor': number;
  'level-resistance': number;
}
