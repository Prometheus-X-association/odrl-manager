import { PolicyValidator } from 'PolicyValidator';

export abstract class PolicyEvaluator extends PolicyValidator {
  protected abstract visit(): Promise<boolean>;

  protected evaluate(depth: number = 0, evaluators: Promise<boolean>[]): void {
    evaluators.push(this.visit());
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        const value = (this as any)[prop];
        if (Array.isArray(value)) {
          for (const item of value) {
            if (
              item instanceof PolicyEvaluator &&
              typeof item.evaluate === 'function'
            ) {
              item.evaluate(depth + 2, evaluators);
            }
          }
        } else if (
          value instanceof PolicyEvaluator &&
          typeof value.evaluate === 'function'
        ) {
          value.evaluate(depth + 1, evaluators);
        }
      }
    }
  }
}
