export enum CopyMode {
  all = 0,
  exclude = 1,
  include = 2,
}
export const copy = (
  instance: Record<string, any> | null | undefined,
  element: Record<string, any>,
  attributes: string[] = [],
  mode: CopyMode = 0,
): void => {
  if (instance) {
    let keys = Object.keys(element);
    if (mode !== CopyMode.all) {
      keys = keys.filter((key) => {
        const included = attributes.includes(key);
        return mode === CopyMode.exclude ? !included : included;
      });
    }
    keys.forEach((key: string) => {
      if (typeof instance[key] !== 'function') {
        instance[key] = element[key];
      }
    });
  }
};

export const getLastTerm = (input: string): string | undefined => {
  const a = input.split('/');
  const b = a.pop();
  return b === '' ? a.pop() : b;
};
