import calcTileType from '../utils.js';

test('Верхний левый', () => {
  const received = calcTileType(0);
  const expected = 'top-left';
  expect(received).toBe(expected);
});

test('Верхний правый', () => {
  const received = calcTileType(7, 8);
  const expected = 'top-right';
  expect(received).toBe(expected);
});

test('Верхний', () => {
  const received = calcTileType(5, 8);
  const expected = 'top';
  expect(received).toBe(expected);
});
test('Нижний левый', () => {
  const received = calcTileType(56, 8);
  const expected = 'bottom-left';
  expect(received).toBe(expected);
});
test('Нижний правый', () => {
  const received = calcTileType(63, 8);
  const expected = 'bottom-right';
  expect(received).toBe(expected);
});
test('Нижний', () => {
  const received = calcTileType(60, 8);
  const expected = 'bottom';
  expect(received).toBe(expected);
});
test('Левый', () => {
  const received = calcTileType(48, 8);
  const expected = 'left';
  expect(received).toBe(expected);
});
test('Правый', () => {
  const received = calcTileType(47, 8);
  const expected = 'right';
  expect(received).toBe(expected);
});
test('Центр', () => {
  const received = calcTileType(13, 8);
  const expected = 'center';
  expect(received).toBe(expected);
});
