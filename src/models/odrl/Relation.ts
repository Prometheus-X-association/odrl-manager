import { ModelBasic } from '../ModelBasic';
import { Asset } from './Asset';

export enum RelationType {
  TARGET = 'target',
}

export class Relation extends ModelBasic {
  type: RelationType;
  asset: Asset;

  constructor(type: RelationType, asset: Asset) {
    super();
    this.type = type;
    this.asset = asset;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
