import { Asset } from 'models/Asset';

export enum RelationType {
  TARGET = 'target',
}

export class Relation {
  type: RelationType;
  asset: Asset;

  constructor(type: RelationType, asset: Asset) {
    this.type = type;
    this.asset = asset;
  }
}
