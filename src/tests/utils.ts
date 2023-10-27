export const _logYellow = (value: string) => {
  console.log(`\x1b[93m${value}\x1b[37m`);
};
export const _logGreen = (value: string) => {
  console.log(`\x1b[32m${value}\x1b[37m`);
};
export const _logObject = (data: any) => {
  console.log(`\x1b[90m${JSON.stringify(data, null, 2)}\x1b[37m`);
};
