import { ModelEssential } from './ModelEssential';

export abstract class Explorable extends ModelEssential {
  protected abstract visit(): Promise<boolean>;

  protected explore(
    pick: Function,
    depth: number = 0,
    entities: Explorable[],
    options?: any,
  ): void {
    if (pick(this, options)) {
      entities.push(this);
    }
    for (const prop in this) {
      if (this.hasOwnProperty(prop)) {
        const value = (this as any)[prop];
        if (Array.isArray(value)) {
          for (const item of value) {
            if (
              item instanceof Explorable &&
              typeof item.explore === 'function'
            ) {
              item.explore(pick, depth + 2, entities, options);
            }
          }
        } else if (
          value instanceof Explorable &&
          typeof value.explore === 'function'
        ) {
          value.explore(pick, depth + 1, entities, options);
        }
      }
    }
  }
}
