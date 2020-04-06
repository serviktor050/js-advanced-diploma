export default function attackHero(position, distance, boardSize) {
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
  const allowedIndexAttack = [];

  let top = stringIndex - distance;
  if (top < 0) {
    top = 0;
  }

  let bottom = stringIndex + distance;
  if (bottom > boardSize - 1) {
    bottom = boardSize - 1;
  }

  let left = columnIndex - distance;
  if (left < 0) {
    left = 0;
  }

  let right = columnIndex + distance;
  if (right > boardSize - 1) {
    right = boardSize - 1;
  }

  for (let i = top; i <= bottom; i += 1) {
    for (let m = left; m <= right; m += 1) {
      allowedIndexAttack.push(board[i][m]);
    }
  }
  return allowedIndexAttack.filter((item) => item !== position);
}
