import { Extension, ModelBasic } from 'models/ModelBasic';
import { Policy } from 'models/odrl/Policy';
import { InstanciatorFunction } from 'PolicyInstanciator';

export class Namespace {
  public uri: string;
  private instanciators: Record<string, InstanciatorFunction>;

  constructor(uri: string) {
    this.uri = uri;
    this.instanciators = {};
  }

  public addInstanciator(
    property: string,
    instanciator: InstanciatorFunction,
  ): void {
    this.instanciators[property] = instanciator;
  }

  public instanciateProperty(
    property: string,
    element: any,
    parent: any,
    root: Policy | null,
    fromArray: boolean = false,
  ): Extension | null {
    if (this.instanciators[property]) {
      return this.instanciators[property](element, parent, root, fromArray);
    }
    return null;
  }
}
