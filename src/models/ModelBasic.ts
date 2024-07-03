import { EntityRegistry } from 'EntityRegistry';
import { randomUUID } from 'node:crypto';

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
        if ((this as any).handleFailure && !result) {
          (this as any).handleFailure();
        }
        return result;
      };
    }
    return descriptor;
  };
};

export abstract class ModelBasic {
  public _rootUID?: string;
  public _objectUID: string;
  public _fetcherUID?: string;
  public _stateFetcherUID?: string;
  public _instanceOf?: string;
  public _namespace?: string | string[];
  constructor() {
    this._objectUID = randomUUID();
    EntityRegistry.addReference(this);
  }

  protected handleFailure() {
    // Todo: Handle Failure
    console.log('handleFailure');
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
