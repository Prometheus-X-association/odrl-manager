import { Explorable } from 'Explorable';
import { AssetCollection } from './AssetCollection';

export class Asset extends Explorable {
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
  protected async visit(): Promise<boolean> {
    return true;
  }
  public async verify(): Promise<boolean> {
    return true;
  }
}
