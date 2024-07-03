import { PolicyFetcher } from 'PolicyFetcher';

interface StateFunctions {
  [key: string]: Function;
}

export abstract class PolicyStateFetcher extends PolicyFetcher {
  constructor() {
    super();
  }

  public get context(): StateFunctions {
    return this._context as StateFunctions;
  }

  /*Todo: Write default*/
}
