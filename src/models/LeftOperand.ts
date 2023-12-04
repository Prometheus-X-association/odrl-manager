import { PolicyValidator } from 'PolicyValidator';

export class LeftOperand extends PolicyValidator {
  private value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public async visit(): Promise<string | number | null> {
    // tmp testing purpose
    if (this.value === 'age') {
      return 21;
    }
    return null;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
