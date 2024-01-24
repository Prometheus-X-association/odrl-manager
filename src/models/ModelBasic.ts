import { PolicyDataFetcher } from 'PolicyDataFetcher';
import { Policy } from 'models/odrl/Policy';
import { randomUUID } from 'node:crypto';

interface EntityReferences {
  [key: string]: any;
}
interface ParentRelations {
  [key: string]: string;
}

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
  private static parentRelations: ParentRelations = {};
  private static entityReferences: EntityReferences = {};

  public _rootUID?: string;
  public _objectUID: string;
  private _fetcherUID?: string;

  constructor() {
    this._objectUID = randomUUID();
    ModelBasic.entityReferences[this._objectUID] = this;
  }

  protected handleFailure() {
    // Todo: Handle Failure
    console.log('handleFailure');
  }

  public static getFetcher(rootUID: string): PolicyDataFetcher | undefined {
    const root: ModelBasic = ModelBasic.entityReferences[rootUID];
    return root?._fetcherUID
      ? ModelBasic.entityReferences[root._fetcherUID]
      : undefined;
  }

  public static addReference(): void {}

  public static cleanReferences(): void {
    ModelBasic.parentRelations = {};
    ModelBasic.entityReferences = {};
  }

  public setParent(parent: ModelBasic): void {
    ModelBasic.parentRelations[this._objectUID] = parent._objectUID;
  }

  public getParent(): ModelBasic {
    const uid = ModelBasic.parentRelations[this._objectUID];
    return ModelBasic.entityReferences[uid];
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
          console.error(`[PolicyValidator] - \x1b[31m${error.message}\x1b[37m`);
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
            if (prop !== '_objectUID') {
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
