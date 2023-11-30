export const copyWithExclusion = (
  instance: Record<string, any> | null | undefined,
  element: Record<string, any>,
  excluded: string[] = [],
): void => {
  if (instance) {
    const keys = Object.keys(element).filter((key) => !excluded.includes(key));
    keys.forEach((key: string) => {
      instance[key] = element[key];
    });
  }
};
