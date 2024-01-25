export enum CopyMode {
  all = 0,
  exclude = 1,
  include = 2,
}
/**
 * Copies specified attributes from 'element' to 'instance' based on the selected mode.
 * @param instance The object to which attributes will be copied.
 * @param element The object from which attributes will be copied.
 * @param attributes An optional array of attributes to include or exclude in the copy process. Default is an empty array.
 * @param mode An optional mode specifying whether to include or exclude attributes. Default is CopyMode.all.
 */
export const copy = (
  instance: Record<string, any> | null | undefined,
  element: Record<string, any>,
  attributes: string[] = [],
  mode: CopyMode = 0,
): void => {
  if (instance) {
    // Get keys of 'element'
    let keys = Object.keys(element);
    // Filter keys based on mode and attributes
    if (mode !== CopyMode.all) {
      keys = keys.filter((key) => {
        const included = attributes.includes(key);
        return mode === CopyMode.exclude ? !included : included;
      });
    }
    // Copy attributes from 'element' to 'instance'
    keys.forEach((key: string) => {
      // Exclude functions from copying
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

/**
 * Checks if the object is an instance of at least one of the specified classes in the array.
 * @param classes The array of classes to check against.
 * @param object The object to check.
 * @returns true if the object is an instance of any of the classes in the array, otherwise false.
 */
export const isInstanceOfAny = (classes: any[], object: any): boolean => {
  for (const value of classes) {
    if (object instanceof value) {
      return true;
    }
  }
  return false;
};
