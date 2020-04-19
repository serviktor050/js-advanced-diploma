// classes
import GamePlay from './GamePlay.js';
import GameState from './GameState.js';

// functions
import themes from '../themes.js';
import heroInformation from '../heroInformation.js';
import cursors from '../cursors.js';
import movementHero from '../movementHero.js';
import attackHero from '../attackHero.js';

// const & let
const userPosition = [];
const enemyPosition = [];
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
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi('prairie');
  }

  async onCellClick(index) {
    // TODO: react to click
    this.index = index;
    if (!this.bisyBoard) {
      if (this.gamePlay.boardEl.style.cursor === 'not-allowed') {
        GamePlay.showError('Действие не может быть выполнено');
      } else if (this.findIndexInArr([...userPosition]) !== -1) {
        this.gamePlay.deselectCell(chooseCharacterIndex);
        this.gamePlay.selectCell(index);
        chooseCharacterIndex = index;
        this.chooseCharacter = [...userPosition].find((item) => item.position === index);
        this.selected = true;
      } else if (!this.selected && this.findIndexInArr([...enemyPosition]) !== -1) {
        GamePlay.showError('Вы выбираете персонажа соперника');
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
        userPosition.forEach(function (item) {
          this.points += item.character.health;
        });
        // Код для обновления уровня
      }
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    this.index = index;
    if (!this.bisyBoard) {
      for (const item of [...userPosition, ...enemyPosition]) {
        if (item.position === index) {
          this.gamePlay.showCellTooltip(heroInformation(item.character), index);
        }
      }

      if (this.selected) {
        boardSize = this.gamePlay.boardSize;
        allowPos = this.chooseCharacter.position;
        allowDis = this.chooseCharacter.character.distance;

        const allowPosition = movementHero(allowPos, allowDis, boardSize);
        allowDis = this.chooseCharacter.character.distanceAttack;

        const allowAttack = attackHero(allowPos, allowDis, boardSize);

        if (this.findIndexInArr(userPosition) !== -1) {
          this.gamePlay.setCursor(cursors.pointer);
        } else if (allowPosition.includes(index) && findIndexInArr([...userPosition, ...enemyPosition]) === -1) {
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
  }

  findIndexInArr(array) {
    return array.findIndex((item) => item.position === this.index);
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
      for (const activeEnemy of [...enemyPosition]) {
        allowDis = this.chooseCharacter.character.distanceAttack;
        allowPos = activeEnemy.position;
        boardSize = this.gamePlay.boardSize;

        const allowAttack = attackHero(allowPos, allowDis, boardSize);
        const target = this.attackOfEnemy(allowAttack);
        if (target !== null) {
          this.enemyAttackers(itemEnemy.character, target);
          return;
        }
      }
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

    for (const activeUser of [...userPosition]) {
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
    }

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
    for (const activeUser of [...userPosition]) {
      if (allowAttack.includes(activeUser.position)) {
        return activeUser;
      }
    }
    return null;
  }

  async enemyAttackers(character, target) {
    await this.heroAttacker(character, target);
    this.activeGamer = 'user';
  }
}
