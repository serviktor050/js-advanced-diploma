import loadingData from '../for_mock_test/loadingData.js';
import loadingGameStateService from '../for_mock_test/GameStateService.js';

jest.mock('../for_mock_test/loadingData.js');
beforeEach(() => {
  jest.resetAllMocks();
});

test('Успешная загрузка метода load', () => {
  const expected = '{"level":3,"activeTheme":"arctic","userPositions":[],"points":123,"maxPoint":123}';
  loadingData.mockReturnValue(expected);
  const recived = loadingGameStateService.load();
  expect(JSON.stringify(recived)).toBe(expected);
});

test('Ошибка при загрузке метода load', () => {
  const expected = '';
  loadingData.mockReturnValue(expected);

  expect(() => {
    loadingGameStateService.load();
  }).toThrow();
});
