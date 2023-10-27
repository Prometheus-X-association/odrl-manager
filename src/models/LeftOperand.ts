export class LeftOperand {
  private value: string;

  constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public async evaluate(): Promise<string | number | null> {
    // tmp testing purpose
    if (this.value === 'age') {
      return 21;
    }
    return null;
  }
}
