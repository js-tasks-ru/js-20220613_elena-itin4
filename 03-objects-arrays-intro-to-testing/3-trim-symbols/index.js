/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (typeof size !== 'number') {
    return  string;
  }
  let res = "";
  const arr = string.split('');
  let counter = 1;
  for (let i = 1; i < arr.length;i++) {
    if (counter++ <= size) {
      res += arr[i - 1];
    }
    if (arr[i - 1] !== arr[i]) {
      counter = 1;
      if (i === arr.length - 1) {
        res += arr[i];
      }
    }
  }
  return res;
}
