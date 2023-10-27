import { Asset } from 'models/Asset';
import { Constraint } from 'models/Constraint';

export class AssetCollection extends Asset {
  source?: string;
  refinement?: Constraint[];
}
