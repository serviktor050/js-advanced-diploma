import attackHero from '../movementHero.js';

test('Атака разрешена', () => {
    const boardSize = 8
    const distance = 1;
    const position = 10;
    const expected = [11, 18, 19, 9, 17, 2, 1, 3];
    const received = attackHero(position, distance, boardSize);
    expect(received).toEqual(expected);
  });
  