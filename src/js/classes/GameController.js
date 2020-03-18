import themes from '../themes.js';
import GamePlay from './GamePlay.js';
import heroInformation from '../heroInformation.js';
import GameState from './GameState.js';

const userPosition = [];
const enemyPosition = [];
let chooseCharacterIndex = 0;

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.bisyBoard = false;
    this.chooseCharacter = {};
    this.selected = false;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi('prairie');
  }

  onCellClick(index) {
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
}
