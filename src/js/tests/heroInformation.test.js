import heroInformation from '../heroInformation.js';

test('Вывод информации', () => {
  const hero = {
    level: 1,
    health: 50,
    type: 'daemon',
    attack: 10,
    defence: 40,
    distance: 1,
    distanceAttack: 4,
  };

  const received = heroInformation(hero);
  const expected = '🎖1 ⚔10 🛡40 ❤50';

  expect(received).toEqual(expected);
});
