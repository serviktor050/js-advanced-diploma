// classes
import GamePlay from './GamePlay.js';
import GameState from './GameState.js';
import PositionedCharacter from './PositionedCharacter.js';

// functions & consts
import heroInformation from '../heroInformation.js';
import cursors from '../cursors.js';
import movementHero from '../movementHero.js';
import attackHero from '../attackHero.js';
import { generateTeam } from '../generators.js';
import { userTeam, userTeamFirstLevel, enemyTeam } from '../teams.js';
import themes from '../themes.js';

// lets
let userPosition = [];
let enemyPosition = [];
let chooseCharacterIndex = 0;
let boardSize;
let allowPos;
let allowDis;

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.bisyBoard = false;
    this.chooseCharacter = {};
    this.selected = false;
    this.activeGamer = 'user';
    this.points = 0;
    this.level = 1;
    this.index = 0;
    this.activeTheme = themes.prairie;
    this.userTeam = [];
    this.enemyTeam = [];
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.eventWithMouse();
    
    this.nextLevel();
  }

  findIndexInArr(array) {
    return array.findIndex((item) => item.position === this.index);
  }

  async onCellClick(index) {
    // TODO: react to click
    this.index = index;
    if (!this.bisyBoard) {
      if (this.gamePlay.boardEl.style.cursor === 'not-allowed') {
        this.gamePlay.showError('Действие не может быть выполнено');
      } else if (this.findIndexInArr([...userPosition]) !== -1) {
        this.gamePlay.deselectCell(chooseCharacterIndex);
        this.gamePlay.selectCell(index);
        chooseCharacterIndex = index;
        this.chooseCharacter = [...userPosition].find((item) => item.position === index);
        this.selected = true;
      } else if (!this.selected && this.findIndexInArr([...enemyPosition]) !== -1) {
        this.gamePlay.showError('Вы выбираете персонажа соперника');
      } else if (this.selected && this.gamePlay.boardEl.style.cursor === 'pointer') {
        this.chooseCharacter.position = index;
        this.gamePlay.deselectCell(chooseCharacterIndex);
        this.gamePlay.selectCell(index);
        this.selected = false;
        this.gamePlay.redrawPositions([...userPosition, ...enemyPosition]);
        this.activeGamer = 'enemy';
        this.opponentResponse();
      } else if (this.selected && this.gamePlay.boardEl.style.cursor === 'crosshair') {
        const enemyHero = [...enemyPosition].find((item) => item.position === index);
        this.gamePlay.deselectCell(chooseCharacterIndex);
        this.gamePlay.deselectCell(index);
        this.gamePlay.setCursor(cursors.auto);
        this.selected = false;

        await this.heroAttacker(this.chooseCharacter.character, enemyHero);
        if (enemyPosition.length > 0) {
          this.opponentResponse();
        }
      }
    }
  }

  async heroAttacker(attacker, target) {
    const hero = target.character;
    let damage = Math.max(attacker.attack - hero.defence, attacker.attack * 0.1);
    damage = Math.floor(damage);

    await this.gamePlay.showDamage(target.position, damage);
    hero.health -= damage;
    this.activeGamer = this.activeGamer === 'user' ? 'enemy' : 'enemy';
    if (hero.health <= 0) {
      userPosition = userPosition.filter((item) => item.position !== target.position);
      enemyPosition = enemyPosition.filter((item) => item.position !== target.position);
      if (userPosition.length === 0) {
        this.gamePlay.showMessage('Вы проиграли');
        this.bisyBoard = true;
      }
      if (enemyPosition.length === 0) {
        userPosition.forEach((item) => {
          this.points += item.character.health;
        }, this);
        this.levelUp();
        this.level += 1;
        this.nextLevel();
      }
    }
    this.gamePlay.redrawPositions([...userPosition, ...enemyPosition]);
  }

  levelUp() {
    userPosition.forEach((item) => {
      const currentHero = item.character;
      currentHero.level += 1;
      currentHero.attack = this.attackAfter(currentHero.attack, currentHero.health);
      currentHero.defence = this.attackAfter(currentHero.defence, currentHero.health);
      currentHero.health = (currentHero.health + 80) < 100 ? currentHero.health + 80 : 100;
    });
  }

  attackAfter(attackBefore, life) {
    return Math.floor(Math.max(attackBefore, attackBefore * (1.8 - life / 100)));
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.index = index;
    if (!this.bisyBoard) {
      [...userPosition, ...enemyPosition].forEach((item) => {
        if (item.position === index) {
          this.gamePlay.showCellTooltip(heroInformation(item.character), index);
        }
      }, this);

      if (this.selected) {
        boardSize = this.gamePlay.boardSize;
        allowPos = this.chooseCharacter.position;
        allowDis = this.chooseCharacter.character.distance;

        const allowPosition = movementHero(allowPos, allowDis, boardSize);
        allowDis = this.chooseCharacter.character.distanceAttack;

        const allowAttack = attackHero(allowPos, allowDis, boardSize);

        if (this.findIndexInArr(userPosition) !== -1) {
          this.gamePlay.setCursor(cursors.pointer);
        } else if (allowPosition.includes(index)
        && this.findIndexInArr([...userPosition, ...enemyPosition]) === -1) {
          this.gamePlay.selectCell(index, 'green');
          this.gamePlay.setCursor(cursors.pointer);
        } else if (allowAttack.includes(index) && this.findIndexInArr(enemyPosition) !== -1) {
          this.gamePlay.selectCell(index, 'red');
          this.gamePlay.setCursor(cursors.crosshair);
        } else {
          this.gamePlay.setCursor(cursors.notallowed);
        }
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.chooseCharacter.position !== index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
  }

  eventWithMouse() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.newGame.bind(this));
  }

  opponentResponse() {
    if (this.activeGamer === 'enemy') {
      // Перемещение
      const index = Math.floor(Math.random() * [...enemyPosition].length);
      const enemy = [...enemyPosition][index];
      this.enemyHeroMoving(enemy);
      this.gamePlay.redrawPositions([...userPosition, ...enemyPosition]);
      this.activeGamer = 'user';

      // Атака
      [...enemyPosition].forEach((activeEnemy) => {
        allowDis = this.chooseCharacter.character.distanceAttack;
        allowPos = activeEnemy.position;
        boardSize = this.gamePlay.boardSize;

        const allowAttack = attackHero(allowPos, allowDis, boardSize);
        const target = this.attackOfEnemy(allowAttack);
        if (target !== null) {
          this.enemyAttackers(activeEnemy.character, target);
        }
      }, this);
    }
  }

  enemyHeroMoving(enemy) {
    const activeEnemy = enemy;
    const activeEnemyDistance = activeEnemy.character.distance;

    let row;
    let column;
    let stepRow;
    let stepColumn;
    let endPoint;
    const activeEnemyRow = this.posRow(activeEnemy.position);
    const activeEnemyColumn = this.posColumn(activeEnemy.position);
    let userObj = {};

    [...userPosition].forEach((activeUser) => {
      const activeUserRow = this.posRow(activeUser.position);
      const activeUserColumn = this.posColumn(activeUser.position);
      stepRow = activeEnemyRow - activeUserRow;
      stepColumn = activeEnemyColumn - activeUserColumn;
      endPoint = Math.abs(stepRow) + Math.abs(stepColumn);

      if (userObj.steps === undefined || endPoint < userObj.steps) {
        userObj = {
          steprow: stepRow,
          stepcolumn: stepColumn,
          steps: endPoint,
          positionRow: activeUserRow,
          positionColumn: activeUserColumn,
        };
      }
    }, this);

    if (Math.abs(userObj.steprow) === Math.abs(userObj.stepcolumn)) {
      if (Math.abs(userObj.steprow) > activeEnemyDistance) {
        row = (activeEnemyRow - (activeEnemyDistance * Math.sign(userObj.steprow)));
        column = (activeEnemyColumn - (activeEnemyDistance * Math.sign(userObj.stepcolumn)));
        activeEnemy.position = this.indexRowColumn(row, column);
      } else {
        row = (activeEnemyRow - (userObj.steprow - (1 * Math.sign(userObj.steprow))));
        column = (activeEnemyColumn - (userObj.stepcolumn - (1 * Math.sign(userObj.steprow))));
        activeEnemy.position = this.indexRowColumn(row, column);
      }
    } else if (userObj.stepcolumn === 0) {
      if (Math.abs(userObj.steprow) > activeEnemyDistance) {
        row = (activeEnemyRow - (activeEnemyDistance * Math.sign(userObj.steprow)));
        activeEnemy.position = this.indexRowColumn(row, activeEnemyColumn);
      } else {
        row = (activeEnemyRow - (userObj.steprow - (1 * Math.sign(userObj.steprow))));
        activeEnemy.position = this.indexRowColumn(row, activeEnemyColumn);
      }
    } else if (userObj.steprow === 0) {
      if (Math.abs(userObj.stepcolumn) > activeEnemyDistance) {
        column = (activeEnemyColumn - (activeEnemyDistance * Math.sign(userObj.stepcolumn)));
        activeEnemy.position = this.indexRowColumn(activeEnemyRow, column);
      } else {
        column = (activeEnemyColumn - (userObj.stepcolumn - (1 * Math.sign(userObj.stepcolumn))));
        activeEnemy.position = this.indexRowColumn(activeEnemyRow, column);
      }
    } else if (Math.abs(userObj.steprow) > Math.abs(userObj.stepcolumn)) {
      if (Math.abs(userObj.steprow) > activeEnemyDistance) {
        row = (activeEnemyRow - (activeEnemyDistance * Math.sign(userObj.steprow)));
        activeEnemy.position = this.indexRowColumn(row, activeEnemyColumn);
      } else {
        row = (activeEnemyRow - (userObj.steprow));
        activeEnemy.position = this.indexRowColumn(row, activeEnemyColumn);
      }
    } else if (Math.abs(userObj.stepcolumn) > activeEnemyDistance) {
      column = (activeEnemyColumn - (activeEnemyDistance * Math.sign(userObj.stepcolumn)));
      activeEnemy.position = this.indexRowColumn(activeEnemyRow, column);
    } else {
      activeEnemy.position = this.indexRowColumn(activeEnemyRow, activeEnemyColumn);
    }
  }

  posRow(index) {
    return Math.floor(index / this.gamePlay.boardSize);
  }

  posColumn(index) {
    return index % this.gamePlay.boardSize;
  }

  indexRowColumn(row, column) {
    return (row * 8) + column;
  }

  attackOfEnemy(allowAttack) {
    [...userPosition].forEach((activeUser) => {
      if (allowAttack.includes(activeUser.position)) {
        return activeUser;
      }
      return null;
    }, this);
  }

  async enemyAttackers(character, target) {
    await this.heroAttacker(character, target);
    this.activeGamer = 'user';
  }

  newGame() {
    this.bisyBoard = false;
    const maxPoint = this.maxPoint();
    const activeGameState = this.stateService.load();
    if (activeGameState) {
      activeGameState.maxPoint = maxPoint;
      this.stateService.save(GameState.from(activeGameState));
    }
    userPosition = [];
    enemyPosition = [];
    this.level = 1;
    this.points = 0;
    this.activeTheme = themes.prairie;
    this.nextLevel();
  }

  maxPoint() {
    let maxPoint = 0;
    try {
      const loadGameState = this.stateService.load();
      if (loadGameState) {
        maxPoint = Math.max(loadGameState.maxPoint, this.points);
      }
    } catch (e) {
      maxPoint = this.points;
      console.log('Ошибка при определении количества очков');
    }
    return maxPoint;
  }

  nextLevel() {
    this.activeGamer = 'user';
    if (this.level === 1) {
      this.userTeam = generateTeam(userTeamFirstLevel, 1, 2);
      this.enemyTeam = generateTeam(enemyTeam, 1, 2);
      this.positionTeams(this.userTeam, this.enemyTeam);
    } else if (this.level === 2) {
      this.activeTheme = themes.desert;
      this.userTeam = generateTeam(userTeam, 1, 1);
      this.enemyTeam = generateTeam(enemyTeam, 2, (this.userTeam.length + userPosition.length));
      this.positionTeams(this.userTeam, this.enemyTeam);
    } else if (this.level === 3) {
      this.activeTheme = themes.arctic;
      this.userTeam = generateTeam(userTeam, 2, 2);
      this.enemyTeam = generateTeam(enemyTeam, 3, (this.userTeam.length + userPosition.length));
      this.positionTeams(this.userTeam, this.enemyTeam);
    } else if (this.level === 4) {
      this.activeTheme = themes.mountain;
      this.userTeam = generateTeam(userTeam, 3, 2);
      this.enemyTeam = generateTeam(enemyTeam, 4, (this.userTeam.length + userPosition.length));
      this.positionTeams(this.userTeam, this.enemyTeam);
    } else {
      this.bisyBoard = true;
      this.gamePlay.showMessage(`Game Over! Your score: ${this.points}!`);
      return;
    }

    const heroPosition = this.getPosition(userPosition.length);

    for (let i = 0; i < userPosition.length; i += 1) {
      userPosition[i].position = heroPosition.user[i];
      enemyPosition[i].position = heroPosition.enemy[i];
    }

    this.gamePlay.drawUi(this.activeTheme);
    this.gamePlay.redrawPositions([...userPosition, ...enemyPosition]);
  }

  positionTeams(firstTeam, secondTeam) {
    for (let i = 0; i < firstTeam.length; i += 1) {
      userPosition.push(new PositionedCharacter(firstTeam[i], 0));
    }
    for (let i = 0; i < secondTeam.length; i += 1) {
      enemyPosition.push(new PositionedCharacter(secondTeam[i], 0));
    }
  }

  getPosition(value) {
    const position = {
      user: [],
      enemy: [],
    };
    let random;
    for (let i = 0; i < value; i += 1) {
      do {
        random = this.randomPosition();
      } while (position.user.includes(random));
      position.user.push(random);

      do {
        this.randomPosition(6);
      } while (position.enemy.includes(random));
      position.enemy.push(random);
    }
    return position;
  }

  randomPosition(value = 0) {
    return (Math.floor(Math.random() * 8) * 8) + ((Math.floor(Math.random() * 2) + value));
  }
}
