import movementHero from '../movementHero.js';
import originalArray from '../originalArray.js';

test('Перемещение на 1 клетку', () => {
  const boardSize = 8
  const distance = 1;
  const position = 18;
  const expected = [9, 10, 11, 17, 19, 22, 23, 24];
  const arrayHero = movementHero(position, distance, boardSize);
  const received = originalArray(arrayHero);
  expect(received).toEqual(expected);
});

test('Перемещение на 2 клетки', () => {
  const boardSize = 8
  const distance = 2;
  const position = 19;
  const expected = [1, 3, 5, 17, 21, 58];
  const arr = movementHero(position, distance, boardSize);
  const received = originalArray(arr);
  expect(received).toEqual(expected);
});
