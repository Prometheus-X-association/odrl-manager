import { ModelBasic } from '../ModelBasic';
import { EntityRegistry } from 'EntityRegistry';

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
      const fetcher = this._rootUID
        ? EntityRegistry.getFetcherFromPolicy(this._rootUID)
        : undefined;
      if (fetcher) {
        return fetcher.context[this.value]();
      } else {
        console.warn(
          `\x1b[93m/!\\No fetcher found, can't evaluate ${this.value}\x1b[37m`,
        );
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
