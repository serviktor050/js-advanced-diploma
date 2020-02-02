import Character from '../classes/Character.js';

test('Ошибка при создании new Character', () => {
  expect(() => {
    new Character();
  }).toThrow();
});

test('Успешное создание Swordsman', () => {
  class Swordsman extends Character {
    constructor(level) {
      super(level);
      this.level = level;
      this.attack = 40;
      this.defence = 10;
      this.distance = 4;
      this.distanceAttack = 1;
      this.health = 100;
      this.type = 'swordsman';
    }
  }
  const expected = {
    level: 1,
    health: 100,
    type: 'swordsman',
    attack: 40,
    defence: 10,
    distance: 4,
    distanceAttack: 1,
  };
  const received = new Swordsman(1);
  expect(received).toEqual(expected);
});
