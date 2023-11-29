const _logGreen = (value: string) => {
  console.log(`\x1b[32m${value}\x1b[37m`);
};
const _logYellow = (value: string) => {
  console.log(`\x1b[93m${value}\x1b[37m`);
};
export abstract class DebugMonitor {
  public debug(depth: number = 0): void {
    const indentation = '  '.repeat(depth);
    _logYellow(`${indentation}Class ${this.constructor.name}:`);

    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        const value = (this as any)[prop];

        if (Array.isArray(value)) {
          console.log(`${indentation}  ${prop}: \x1b[36m[\x1b[37m`);
          for (const item of value) {
            if (
              item instanceof DebugMonitor &&
              typeof item.debug === 'function'
            ) {
              item.debug(depth + 2);
            } else {
              console.log(`${indentation}    ${item}`);
            }
          }
          console.log(`${indentation}  \x1b[36m]\x1b[37m`);
        } else if (
          value instanceof DebugMonitor &&
          typeof value.debug === 'function'
        ) {
          value.debug(depth + 1);
        } else {
          if (typeof value === 'object' && value !== null) {
            console.log(`\x1b[31m${indentation}  -${prop}: ${value}\x1b[37m`);
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
