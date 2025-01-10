export function parsePolicy(inputPolicy: any): any {
  const removeOdrlPrefix = (value: string): string => {
    return value.startsWith('odrl:') ? value.substring(5) : value;
  };

  const processObject = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map((item) => processObject(item));
    } else if (obj !== null && typeof obj === 'object') {
      const processed: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const newKey = removeOdrlPrefix(key);
        processed[newKey] = processObject(value);
      }
      return processed;
    } else if (typeof obj === 'string') {
      return removeOdrlPrefix(obj);
    } else {
      return obj;
    }
  };
  return processObject(inputPolicy);
}
