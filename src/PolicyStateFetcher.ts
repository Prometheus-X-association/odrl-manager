import { PolicyFetcher } from 'PolicyFetcher';

interface StateFunctions {
  [key: string]: Function;
}

export abstract class PolicyStateFetcher extends PolicyFetcher {
  constructor() {
    super();
    const _context: StateFunctions = {};
    const properties = Object.getOwnPropertyNames(PolicyStateFetcher.prototype);
    properties.forEach((property) => {
      const value = this[property as keyof PolicyStateFetcher];
      if (property.startsWith('get') && typeof value === 'function') {
        const key = property.charAt(3).toLowerCase() + property.slice(4);
        _context[key] = value.bind(this);
      }
    });
    this._context = {
      ..._context,
      ...this.context,
    };
  }

  /**
   * Gets the context containing state functions
   * @returns {StateFunctions} The state functions context
   */
  public get context(): StateFunctions {
    return this._context as StateFunctions;
  }

  /**
   * Gets the compensation state
   * @returns {Promise<boolean>} The compensation state
   * @protected
   */
  protected async getCompensate(): Promise<boolean> {
    return false;
  }
}
