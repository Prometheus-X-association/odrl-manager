import { EntityRegistry } from 'EntityRegistry';
import { ModelBasic } from 'models/ModelBasic';
import { AtomicConstraint } from 'models/odrl/AtomicConstraint';
import { randomUUID } from 'node:crypto';

/**
 * Decorator for marking custom methods
 * @returns {MethodDecorator} A decorator that registers custom methods
 */
export const Custom = (): MethodDecorator => {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    if (descriptor && typeof descriptor.value === 'function') {
      target.customMethods = target.customMethods || [];
      target.customMethods.push(key);
    }
  };
};

interface ContextFunctions {
  [key: string]: Function;
}

export abstract class PolicyFetcher {
  private bypass: string[] = [];
  protected _context: ContextFunctions = {};
  public _objectUID: string;
  protected options: any = {};
  protected currentNode?: AtomicConstraint;
  constructor() {
    this._objectUID = randomUUID();
    EntityRegistry.addReference(this);
    const prototype = Object.getPrototypeOf(this);
    const customs = prototype.customMethods || [];
    customs.forEach((method: string) => {
      const propertyName = method.replace(/^get/, '');
      const lowercasePropertyName =
        propertyName.charAt(0).toLowerCase() + propertyName.slice(1);
      this._context[lowercasePropertyName as keyof PolicyFetcher] = (
        this[method as keyof PolicyFetcher] as Function
      ).bind(this);
    });
  }

  /**
   * Sets options for the policy request
   * @param {any} options - The options to set
   */
  public setRequestOptions(options: any) {
    this.options = options;
  }

  /**
   * Sets the current node being processed
   * @param {ModelBasic} node - The node to set as current
   */
  public setCurrentNode(node: ModelBasic) {
    this.currentNode = node as AtomicConstraint;
  }

  public hasBypassFor(name: string) {
    return this.bypass.includes(name);
  }

  public setBypassFor(name: string) {
    return this.bypass.push(name);
  }

  abstract get context(): ContextFunctions;
}
