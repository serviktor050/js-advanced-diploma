/**
 * Entry point of app: don't change this
 */
import GamePlay from './classes/GamePlay.js';
import GameController from './classes/GameController.js';
import GameStateService from './classes/GameStateService.js';

const gamePlay = new GamePlay();
gamePlay.bindToDOM(document.querySelector('#game-container'));

const stateService = new GameStateService(localStorage);

const gameCtrl = new GameController(gamePlay, stateService);
gameCtrl.init();

// don't write your code here
