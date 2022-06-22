/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const partsArray = path.split(".");
  return (obj) => {
    let value = {...obj};
    for (let i = 0; i < partsArray.length; i++) {
      if (typeof value[partsArray[i]] === 'undefined') {
        return undefined;
      } else {
        value = value[partsArray[i]];
      }
    }
    return value;
  };
}
