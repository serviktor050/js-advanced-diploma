export default function heroInformation(hero) {
  const symbolLevel = String.fromCodePoint(0x1F396);
  const symbolAttack = String.fromCodePoint(0x2694);
  const symbolDefence = String.fromCodePoint(0x1F6E1);
  const symbolHealth = String.fromCodePoint(0x2764);
  const result = `${symbolLevel}${hero.level} ${symbolAttack}${hero.attack} ${symbolDefence}${hero.defence} ${symbolHealth}${hero.health}`;
  return result;
}
