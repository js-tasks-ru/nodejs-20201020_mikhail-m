function sum(a, b) {
  if (!(Number.isInteger(a) && Number.isInteger(b))) {
    throw new TypeError('Ошибка TypeError', 'index.js', 3);}
  else {
    return a + b;
  }
}

module.exports = sum;
