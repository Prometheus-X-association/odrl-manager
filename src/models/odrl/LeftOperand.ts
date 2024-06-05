import { ModelBasic } from '../ModelBasic';
import { EntityRegistry } from 'EntityRegistry';

export class LeftOperand extends ModelBasic {
  private value: string;

  constructor(value: string) {
    super();
    this.value = value;
  }

  public getValue(): string {
    //
    return this.value;
  }

  public async evaluate(): Promise<[string | number, string[]] | null> {
    try {
      const fetcher = this._rootUID
        ? EntityRegistry.getDataFetcherFromPolicy(this._rootUID)
        : undefined;
      if (fetcher) {
        const _value = this.value.charAt(0).toLowerCase() + this.value.slice(1);
        const types = fetcher.getTypes(_value);
        const value = await fetcher.context[_value]();
        if (types.length && types.includes('date')) {
          const dateTime = new Date(value).getTime();
          if (isNaN(dateTime)) {
            console.warn(
              `\x1b[93m/!\\"${value}" is not a supported Date\x1b[37m`,
            );
          }
          return [dateTime, types];
        }
        return [value, types];
      } else {
        console.warn(
          `\x1b[93m/!\\No data fetcher found, can't evaluate "${this.value}"\x1b[37m`,
        );
      }
    } catch (error: any) {
      console.error(`LeftOperand function "${this.value}" not found`);
    }
    return null;
  }

  public async verify(): Promise<boolean> {
    return true;
  }
}
