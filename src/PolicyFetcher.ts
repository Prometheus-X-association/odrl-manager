import { EntityRegistry } from 'EntityRegistry';
import { randomUUID } from 'node:crypto';

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
  protected _context: ContextFunctions = {};
  public _objectUID: string;
  protected options: any = {};

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

  public setRequestOptions(options: any) {
    this.options = options;
  }

  abstract get context(): ContextFunctions;
}
