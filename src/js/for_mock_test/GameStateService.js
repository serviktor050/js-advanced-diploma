import loadingData from './loadingData.js';

export default class loadingGameStateService {
  constructor(storage) {
    this.storage = storage;
  }

  save(state) {
    this.storage.setItem('state', JSON.stringify(state));
  }

  static load() {
    try {
      const loadedData = loadingData();
      return JSON.parse(loadedData);
    } catch (e) {
      throw new Error('Invalid state');
    }
  }
}
