import { DebugMonitor } from 'DebugMonitor';
import { Asset } from 'models/Asset';

export enum RelationType {
  TARGET = 'target',
}

export class Relation extends DebugMonitor {
  type: RelationType;
  asset: Asset;

  constructor(type: RelationType, asset: Asset) {
    super();
    this.type = type;
    this.asset = asset;
  }
}
