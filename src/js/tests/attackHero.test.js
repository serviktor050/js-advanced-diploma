import attackHero from '../attackHero.js';

test('Атака разрешена', () => {
  const boardSize = 8;
  const distance = 1;
  const position = 10;
  const expected = [1, 2, 3, 9, 11, 17, 18, 19];
  const received = attackHero(position, distance, boardSize);
  expect(received).toEqual(expected);
});
