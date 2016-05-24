export function required(name, type='function') {
  return function propertyNotPresent() {
    throw new Error(`The required ${type} ${name} was not defined`)
  }
}
