export abstract class PolicyValidator {
  public abstract localValidation(): void;
  //
  public validate(depth: number = 0): void {
    try {
      this.localValidation();
      for (const prop in this) {
        if (this.hasOwnProperty(prop)) {
          const value = (this as any)[prop];
          if (Array.isArray(value)) {
            for (const item of value) {
              if (
                item instanceof PolicyValidator &&
                typeof item.validate === 'function'
              ) {
                item.validate(depth + 2);
              } else {
                throw new Error(
                  `Invalid entry: ${JSON.stringify(item, null, 2)}`,
                );
              }
            }
          } else if (
            value instanceof PolicyValidator &&
            typeof value.validate === 'function'
          ) {
            value.validate(depth + 1);
          } else {
            if (typeof value === 'object' && value !== null) {
              throw new Error(
                `Invalid entry: ${JSON.stringify(value, null, 2)}`,
              );
            }
          }
        }
      }
    } catch (error: any) {
      console.error(`\x1b[31m${error.message}\x1b[37m`);
    }
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
              item instanceof PolicyValidator &&
              typeof item.debug === 'function'
            ) {
              item.debug(depth + 2);
            } else {
              console.log(`\x1b[31m${indentation}    ${item}\x1b[37m`);
            }
          }
          console.log(`${indentation}  \x1b[36m]\x1b[37m`);
        } else if (
          value instanceof PolicyValidator &&
          typeof value.debug === 'function'
        ) {
          value.debug(depth + 1);
        } else {
          if (typeof value === 'object' && value !== null) {
            console.log(
              `\x1b[31m${indentation}  -${prop}: ${JSON.stringify(
                value,
                null,
                2,
              )}\x1b[37m`,
            );
          } else {
            console.log(
              `${indentation}  \x1b[32m-\x1b[37m${prop}: \x1b[90m${value}\x1b[37m`,
            );
          }
        }
      }
    }
  }
}
