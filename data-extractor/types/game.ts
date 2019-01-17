export interface GameState {
  enemyCount: number;

  evadePhysical: number;
  evadeMagical: number;

  armor: number;
  resistance: number;

  damageMultiplier: number;
}

export interface ResultDamage {
  physical: number;
  magical: number;
}

export function reduceSumDamage(total: ResultDamage, current: ResultDamage): ResultDamage {
  if (!total) {
    total = {
      physical: 0,
      magical: 0
    };
  }

  return sumDamage(total, current);
}

export function sumDamage(a: ResultDamage, b: ResultDamage): ResultDamage {
  return {
    physical: a.physical + b.physical,
    magical: a.magical + b.magical
  };
}
