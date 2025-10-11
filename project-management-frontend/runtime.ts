// minimal runtime.ts to satisfy generated DTO imports
export function mapValues(data: any, fn: (v: any) => any): any {
  if (!data) return data;
  return Object.keys(data).reduce((acc: any, key) => {
    acc[key] = fn(data[key]);
    return acc;
  }, {});
}
