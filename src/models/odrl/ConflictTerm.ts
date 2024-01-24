import { ModelBasic } from '../ModelBasic';

export class ConflictTerm extends ModelBasic {
  public async verify(): Promise<boolean> {
    return true;
  }
}
