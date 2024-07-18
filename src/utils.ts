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
    let keys = Object.keys(element);
    // Filter keys based on mode and attributes
    if (mode !== CopyMode.all) {
      keys = keys.filter((key) => {
        const included = attributes.some((attr) => {
          // Check if the attribute is a regex pattern
          if (attr.startsWith('/') && attr.endsWith('/')) {
            const regex = new RegExp(attr.slice(1, -1));
            return regex.test(key);
          } else {
            return attr === key;
          }
        });
        return mode === CopyMode.exclude ? !included : included;
      });
    }
    // Copy attributes from 'element' to 'instance'
    // while excluding functions from the process
    keys.forEach((key: string) => {
      if (typeof element[key] !== 'function') {
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

export const getNode = (obj: any, path: string): any | undefined => {
  return (
    path &&
    path
      .split('.')
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
        obj,
      )
  );
};

export const Custom = (): MethodDecorator => {
  return (
    target: any,
    key: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    if (descriptor && typeof descriptor.value === 'function') {
      target.customMethods = target.customMethods || [];
      target.customMethods.push(key);
    }
  };
};

export const getDurationMatching = (
  isoDurationString: string,
): RegExpExecArray | null => {
  const durationRegex =
    /^P(?!$)(?:(\d+(?:\.\d+)?)Y)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)W)?(?:(\d+(?:\.\d+)?)D)?(?:T(?=\d)(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;
  return durationRegex.exec(isoDurationString);
};

export const parseISODuration = (
  isoDurationString: string,
  match?: RegExpExecArray | null,
): number => {
  if (!match) {
    match = getDurationMatching(isoDurationString);
  }
  if (!match) {
    throw new Error(`Invalid ISO 8601 duration format: ${isoDurationString}`);
  }
  const [, years, months, weeks, days, hours, minutes, seconds] = match.map(
    (v) => (v ? parseFloat(v) : 0),
  );
  let totalMilliseconds = 0;
  if (years) {
    totalMilliseconds += years * 365.25 * 24 * 60 * 60 * 1000;
  }
  if (months) {
    totalMilliseconds += months * 30.44 * 24 * 60 * 60 * 1000;
  }
  if (weeks) {
    totalMilliseconds += weeks * 7 * 24 * 60 * 60 * 1000;
  }
  if (days) {
    totalMilliseconds += days * 24 * 60 * 60 * 1000;
  }
  if (hours) {
    totalMilliseconds += hours * 60 * 60 * 1000;
  }
  if (minutes) {
    totalMilliseconds += minutes * 60 * 1000;
  }
  if (seconds) {
    totalMilliseconds += seconds * 1000;
  }
  if (totalMilliseconds === 0) {
    throw new Error(
      `No valid duration components found in: ${isoDurationString}`,
    );
  }
  return totalMilliseconds;
};
