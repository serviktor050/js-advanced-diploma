import themes from '../themes.js';
import GamePlay from './GamePlay.js';
import heroInformation from '../heroInformation.js';

const userPosition = [];
const enemyPosition = [];

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.bisyBoard = false;
    this.chouseCharacter = {};
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi('prairie');
  }

  onCellClick(index) {
    // TODO: react to click
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
    if (this.chouseCharacter.position !== index) {
      this.gamePlay.deselectCell(index);
    }
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursors.auto);
  }

  eventWithMouse() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellLeave.bind(this));
  }
}
