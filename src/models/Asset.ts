import { DebugMonitor } from 'DebugMonitor';
import { AssetCollection } from 'models/AssetCollection';

export class Asset extends DebugMonitor {
  uid?: string;
  partOf?: AssetCollection[];
  hasPolicy?: string;

  constructor(
    target:
      | string
      | { uid?: string; partOf?: AssetCollection[]; hasPolicy?: string },
  ) {
    super();
    if (typeof target === 'string') {
      this.uid = target;
    } else {
      this.uid = target.uid;
      this.partOf = target.partOf;
      this.hasPolicy = target.hasPolicy;
    }
  }
}
