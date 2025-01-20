import { ModelBasic } from '../ModelBasic';
import { EntityRegistry } from 'EntityRegistry';

export class LeftOperand extends ModelBasic {
  public value: string;

  /**
   * Creates an instance of LeftOperand
   * @param {string} value - The value to be assigned to the left operand
   */
  constructor(value: string) {
    super();
    this.value = value;
  }

  /**
   * Gets the value of the left operand
   * @returns {string} The value of the left operand
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Evaluates the left operand by fetching and processing its value
   * @returns {Promise<[string | number, string[]] | null>} A tuple containing the evaluated value and its types, or null if evaluation fails
   */
  public async evaluate(): Promise<[string | number, string[]] | null> {
    try {
      const fetcher = this._rootUID
        ? EntityRegistry.getDataFetcherFromPolicy(this._rootUID)
        : undefined;
      if (fetcher) {
        const _value = this.value.charAt(0).toLowerCase() + this.value.slice(1);
        const types = fetcher.getTypes(_value);
        fetcher.setCurrentNode(this.getParent());
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

  /**
   * Verifies the left operand
   * @returns {Promise<boolean>} Always returns true
   */
  public async verify(): Promise<boolean> {
    return true;
  }
}
