import { ModelEssential } from '../ModelEssential';

export class ConflictTerm extends ModelEssential {
  public async verify(): Promise<boolean> {
    return true;
  }
}
