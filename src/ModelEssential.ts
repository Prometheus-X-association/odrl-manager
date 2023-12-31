import { ContextFetcher } from 'ContextFetcher';
import { randomUUID } from 'node:crypto';
interface ParentRelations {
  [key: string]: ModelEssential;
}
export abstract class ModelEssential {
  private static parentRelations: ParentRelations = {};
  protected static fetcher: ContextFetcher;
  public _objectUID: string;
  constructor() {
    this._objectUID = randomUUID();
  }

  public static setFetcher(fetcher: ContextFetcher): void {
    ModelEssential.fetcher = fetcher;
  }

  public setParent(parent: ModelEssential): void {
    ModelEssential.parentRelations[this._objectUID] = parent;
  }

  public getParent(): ModelEssential {
    return ModelEssential.parentRelations[this._objectUID];
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
                    item instanceof ModelEssential &&
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
                value instanceof ModelEssential &&
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
              item instanceof ModelEssential &&
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
          value instanceof ModelEssential &&
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
