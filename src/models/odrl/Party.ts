import { ModelBasic } from '../ModelBasic';

export class Party extends ModelBasic {
  public async verify(): Promise<boolean> {
    return true;
  }
}
