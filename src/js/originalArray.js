export default function originalArray(data) {
  const array = [];
  const object = {};
  for (let i = 0; i < data.length; i += 1) {
    object[data[i]] = data[i];
  }
  Object.values(object).forEach((value) => {
    if (Object.prototype.hasOwnProperty.call(object, value)) {
      array.push(object[value]);
    }
  });
  return array;
}
