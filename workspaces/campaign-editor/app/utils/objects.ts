export function objectHas<T extends object>(object: object, prop: keyof T): object is Required<T> {
  return prop in object && object[prop as keyof object] !== undefined
}
