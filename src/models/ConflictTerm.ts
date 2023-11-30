import { PolicyValidator } from 'PolicyValidator';

export class ConflictTerm extends PolicyValidator {
  public async verify(): Promise<boolean> {
    return true;
  }
}
