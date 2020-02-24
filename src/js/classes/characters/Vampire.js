import Character from '../Character.js';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.type = 'vampire';
    this.level = level;
    this.attack = 40;
    this.defence = 10;
    this.distance = 2;
    this.distanceAttack = 2;
  }
}
