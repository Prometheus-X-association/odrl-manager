import { ModelEssential } from '../../ModelEssential';

export class LeftOperand extends ModelEssential {
  private value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public async visit(): Promise<string | number | null> {
    try {
      if (ModelEssential.fetcher) {
        return ModelEssential.fetcher.context[this.value]();
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
