import { ModelBasic } from '../ModelBasic';

export class LeftOperand extends ModelBasic {
  private value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public async evaluate(): Promise<string | number | null> {
    try {
      const fetcher = ModelBasic.getFetcher();
      if (fetcher) {
        return fetcher.context[this.value]();
      } else {
        console.warn(`No fetcher found, can't evaluate ${this.value}`);
      }
    } catch (error: any) {
      console.error(`LeftOperand function ${this.value} not found`);
    }
    return null;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
