/**
 * The function checks if all the properties of an object are also objects.
 * @param {any} obj - The parameter `obj` is an object that is being passed as an argument to the
 * function `ObjectChildsAreObjects`. The function checks if all the properties of the object `obj` are
 * also objects.
 * @returns a boolean value. It will return `true` if all the properties of the input object are
 * objects themselves, and `false` otherwise.
 */
export function ObjectChildsAreObjects(obj: any) {
  for (const prop in obj) {
    if (typeof obj[prop] !== 'object') {
      return false;
    }
  }
  return true;
}
