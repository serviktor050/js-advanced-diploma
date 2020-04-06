import movementHero from '../movementHero.js';
import originalArray from '../originalArray.js';

test('Перемещение на 1 клетку', () => {
  const boardSize = 8
  const distance = 1;
  const position = 18;
  const expected = [9, 10, 11, 17, 19, 25, 26, 27];
  const arrayHero = movementHero(position, distance, boardSize);
  const received = originalArray(arrayHero);
  expect(received).toEqual(expected);
});

test('Перемещение на 2 клетки', () => {
  const boardSize = 8
  const distance = 2;
  const position = 19;
  const expected = [1, 3, 5, 10, 11, 12, 17, 18, 20, 21, 26, 27, 28, 33, 35, 37];
  const arrayHero = movementHero(position, distance, boardSize);
  const received = originalArray(arrayHero);
  expect(received).toEqual(expected);
});
