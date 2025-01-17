import { EntityRegistry } from 'EntityRegistry';
import { randomUUID } from 'node:crypto';
import { RuleProhibition } from './odrl/RuleProhibition';

export const HandleFailure = (): MethodDecorator => {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    if (descriptor && typeof descriptor.value === 'function') {
      const originalMethod = descriptor.value;
      descriptor.value = async function (...args: any[]) {
        const result = await originalMethod.apply(this, args);
        if ((this as any).handleFailure /*&& !result*/) {
          await (this as any).handleFailure(result);
        }
        return result;
      };
    }
    return descriptor;
  };
};

type ExtensionValue = ModelBasic | unknown | null;
interface ExtensionList {
  [key: string]: ExtensionValue;
}

export interface Extension {
  name: string;
  value: ExtensionValue;
}

export abstract class ModelBasic {
  public _rootUID?: string;
  public _objectUID: string;
  public _fetcherUID?: string;
  public _stateFetcherUID?: string;
  public _instanceOf?: string;
  public _namespace?: string | string[];
  public _extension?: string;

  constructor() {
    this._objectUID = randomUUID();
    EntityRegistry.addReference(this);
  }

  protected async handleFailure(result: boolean) {
    if (this._instanceOf === 'AtomicConstraint') {
      const parent = this.getParent();
      if ((parent._instanceOf === 'RuleProhibition' && result) || !result) {
        EntityRegistry.addFailure(this);
      }
    }
  }

  /**
   * Adds an extension to the current target object. An extension is an additional property
   * that can be attached to a policy to extend its functionality as decribed by it's context.
   *
   * @param {Extension} ext - The extension to add, containing a name and a value.
   * @param {string} prefix - The prefix (or context) associated with the extension, used to
   *                          identify the namespace from which the extension originates.
   * @returns {void}
   */
  public addExtension(ext: Extension, prefix: string): void {
    const { name, value } = ext;
    (this as unknown as ExtensionList)[name] = value;
    if (value && typeof value === 'object') {
      (value as any)._context = prefix;
    }
  }

  public setParent(parent: ModelBasic): void {
    EntityRegistry.setParent(this, parent);
  }

  public getParent(): ModelBasic {
    return EntityRegistry.getParent(this);
  }

  protected abstract verify(): Promise<boolean>;
  //
  protected validate(depth: number = 0, promises: Promise<boolean>[]): void {
    promises.push(
      (async (): Promise<boolean> => {
        try {
          promises.push(this.verify());
          for (const prop in this) {
            if (this.hasOwnProperty(prop)) {
              const value = (this as any)[prop];
              if (Array.isArray(value)) {
                for (const item of value) {
                  if (
                    item instanceof ModelBasic &&
                    typeof item.validate === 'function'
                  ) {
                    item.validate(depth + 2, promises);
                  } else if (
                    ((typeof item === 'string' ||
                      typeof item === 'boolean' ||
                      item instanceof Date ||
                      typeof item === 'number') &&
                      this._instanceOf === 'RightOperand') ||
                    prop === '@context' ||
                    prop === '_namespace'
                  ) {
                    //
                  } else {
                    throw new Error(
                      `Invalid entry: ${JSON.stringify(item, null, 2)}`,
                    );
                  }
                }
              } else if (
                value instanceof ModelBasic &&
                typeof value.validate === 'function'
              ) {
                value.validate(depth + 1, promises);
              } else {
                if (typeof value === 'object' && value !== null) {
                  throw new Error(
                    `Invalid entry: ${JSON.stringify(value, null, 2)}`,
                  );
                }
              }
            }
          }
          return true;
        } catch (error: any) {
          console.error(`[ModelBasic] - \x1b[31m${error.message}\x1b[37m`);
          return false;
        }
      })(),
    );
  }
  //
  public debug(depth: number = 0): void {
    const indentation = '  '.repeat(depth);
    console.log(
      `\x1b[93m${indentation}Class ${this.constructor.name}:\x1b[37m`,
    );

    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        const value = (this as any)[prop];

        if (Array.isArray(value)) {
          console.log(`${indentation}  ${prop}: \x1b[36m[\x1b[37m`);
          for (const item of value) {
            if (
              item instanceof ModelBasic &&
              typeof item.debug === 'function'
            ) {
              item.debug(depth + 2);
            } else if (
              ((typeof item === 'string' ||
                typeof item === 'boolean' ||
                item instanceof Date ||
                typeof item === 'number') &&
                this._instanceOf === 'RightOperand') ||
              prop === '@context' ||
              prop === '_namespace'
            ) {
              console.log(
                `${indentation}    \x1b[90m${JSON.stringify(
                  item,
                  null,
                  2,
                ).replace(/\n/gm, `\n${indentation}    `)}\x1b[37m`,
              );
            } else {
              console.log(
                `\x1b[31m${indentation}    ${JSON.stringify(item)}\x1b[37m`,
              );
            }
          }
          console.log(`${indentation}  \x1b[36m]\x1b[37m`);
        } else if (
          value instanceof ModelBasic &&
          typeof value.debug === 'function'
        ) {
          value.debug(depth + 1);
        } else {
          if (typeof value === 'object' && value !== null) {
            console.log(
              `\x1b[31m${indentation}  -${prop}: ${JSON.stringify(
                value,
              )}\x1b[37m`,
            );
          } else {
            if (
              prop !== '_objectUID' &&
              prop !== '_rootUID' &&
              prop !== '_instanceOf'
            ) {
              console.log(
                `${indentation}  \x1b[32m-\x1b[37m${prop}: \x1b[90m${value}\x1b[37m`,
              );
            }
          }
        }
      }
    }
  }
}
