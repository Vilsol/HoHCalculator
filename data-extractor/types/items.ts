import {LoadModifiers, Modifier} from './modifiers';

export class Item {

  constructor(data: any) {
    this.name = data.name || this.name;
    this.description = data.description || this.description;
    this.quality = data.quality || this.quality;
    this.cost = data.cost || this.cost;
    this.requiredFlag = data.requiredFlag || this.requiredFlag;
    this.buyInTown = (data.buyInTown === undefined ? this.buyInTown : data.buyInTown);
    this.buyInDungeon = (data.buyInDungeon === undefined ? this.buyInDungeon : data.buyInDungeon);
    this.hasBlueprints = data.hasBlueprints || this.hasBlueprints;
    this.modifiers = data.modifiers;
  }

  readonly name: string = 'unknown';
  readonly description: string = 'unknown';
  readonly quality: string = 'common';
  readonly cost: number = 0;
  readonly requiredFlag: boolean = false;
  readonly buyInTown: boolean = true;
  readonly buyInDungeon: boolean = true;
  readonly hasBlueprints: boolean = false;
  readonly modifiers: Modifier[];

  static fromSval(sval: any): Item {
    return new Item({
      name: sval['name'],
      description: sval['desc'],
      quality: sval['quality'],
      cost: sval['cost'],
      requiredFlag: sval['required-flag'],
      buyInTown: sval['buy-in-town'],
      buyInDungeon: sval['buy-in-dungeon'],
      hasBlueprints: sval['has-blueprints'],
      modifiers: LoadModifiers(sval),
    });
  }

  // TODO Apply to player function

}
