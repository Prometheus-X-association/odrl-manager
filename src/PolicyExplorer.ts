import { PolicyValidator } from './PolicyValidator';

export abstract class PolicyExplorer extends PolicyValidator {
  protected abstract visit(): Promise<boolean>;

  protected explore(depth: number = 0, evaluators: Promise<boolean>[]): void {
    evaluators.push(this.visit());
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        const value = (this as any)[prop];
        if (Array.isArray(value)) {
          for (const item of value) {
            if (
              item instanceof PolicyExplorer &&
              typeof item.explore === 'function'
            ) {
              item.explore(depth + 2, evaluators);
            }
          }
        } else if (
          value instanceof PolicyExplorer &&
          typeof value.explore === 'function'
        ) {
          value.explore(depth + 1, evaluators);
        }
      }
    }
  }
}
