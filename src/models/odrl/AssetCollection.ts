import { Asset } from './Asset';
import { Constraint } from './Constraint';

export class AssetCollection extends Asset {
  source?: string;
  refinement?: Constraint[];
}
