export function originalArray(data) {
  const array = [];
  const object = {};
  for (let i = 0; i < data.length; i += 1) {
    object[data[i]] = data[i];
  }
  for (const m in object) {
    if (Object.prototype.hasOwnProperty.call(object, m)) {
      array.push(object[m]);
    }
  }
  return array;
}
