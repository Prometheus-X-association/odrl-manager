import { PolicyValidator } from 'PolicyValidator';

export class Party extends PolicyValidator {
  public async verify(): Promise<boolean> {
    return true;
  }
}
