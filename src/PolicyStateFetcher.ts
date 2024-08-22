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

  public get context(): StateFunctions {
    return this._context as StateFunctions;
  }

  /*Todo: Write default*/
  protected async getCompensate(): Promise<boolean> {
    return false;
  }
}
