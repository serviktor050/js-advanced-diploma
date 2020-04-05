export function movementHero(position, distance, boardSize) {
  const board = [];
  let stringArray = [];
  const indexOfBoard = boardSize ** 2;

  for (let i = 0; i < indexOfBoard; i += 1) {
    stringArray.push(i);
    if (stringArray.length === boardSize) {
      board.push(stringArray);
      stringArray = [];
    }
  }

  const stringIndex = Math.floor(position / boardSize);
  const columnIndex = position % boardSize;
  const allowedIndex = [];

  for (let i = 0; i < distance; i += 1) {
    let allowedColumn = columnIndex + i;
    if (allowedColumn < boardSize) {
      allowedIndex.push(board[stringIndex][allowedColumn]);
    }

    let allowedString = stringIndex + i;
    if (allowedString < boardSize) {
      allowedIndex.push(board[allowedString][columnIndex]);
    }
    if (allowedColumn < boardSize && allowedString < boardSize) {
      allowedIndex.push(board[allowedString][allowedColumn]);
    }

    allowedColumn = columnIndex - i;
    if (allowedColumn >= 0) {
      allowedIndex.push(board[stringIndex][allowedColumn]);
    }
    if (allowedColumn >= 0 && allowedString < boardSize) {
      allowedIndex.push(board[allowedString][allowedColumn]);
    }

    allowedString = stringIndex - i;
    if (allowedString >= 0) {
      allowedIndex.push(board[allowedString][columnIndex]);
    }
    if (allowedColumn >= 0 && allowedString >= 0) {
      allowedIndex.push(board[allowedString][allowedColumn]);
    }

    allowedColumn = columnIndex + i;
    if (allowedColumn < boardSize && allowedString >= 0) {
      allowedIndex.push(board[allowedString][allowedColumn]);
    }
  }
  return allowedIndex;
}
