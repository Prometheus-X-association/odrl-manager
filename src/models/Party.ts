import { ModelEssential } from '../ModelEssential';

export class Party extends ModelEssential {
  public async verify(): Promise<boolean> {
    return true;
  }
}
