import { GRID_SIZE } from "../constants";
import { Direction, Grid } from "../types/2048";

export function getSquares(grid: Grid, filled = false): number[][] {
  const squares: number[][] = [];

  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid.length; j++) {
      if (filled ? grid[i][j] !== undefined : grid[i][j] === undefined) {
        squares.push([i, j]);
      }
    }
  }

  return squares;
}

export function copyGrid(grid: Grid): Grid {
  return [[...grid[0]], [...grid[1]], [...grid[2]], [...grid[3]]];
}

function areGridsEqual(grid1: Grid, grid2: Grid): boolean {
  for (let col = 0; col < grid1.length; col++) {
    for (let row = 0; row < grid1.length; row++) {
      if (grid1[col][row] !== grid2[col][row]) {
        return false;
      }
    }
  }

  return true;
}

export function moveGrid(grid: Grid, direction: Direction): [number, Grid] {
  const squares = getSquares(grid, true);
  let scoreToAdd = 0;

  const filteredSquares = squares
    // ignore squares on end. they cant be moved anyways
    .filter(([y, x]) => {
      switch (direction) {
        case Direction.Down:
          return y < GRID_SIZE - 1;
        case Direction.Up:
          return y > 0;
        case Direction.Left:
          return x > 0;
        case Direction.Right:
          return x < GRID_SIZE - 1;
      }
    })
    .sort((squareA, squareB) => {
      switch (direction) {
        case Direction.Up:
          return squareA[0] - squareB[0];
        case Direction.Down:
          return squareB[0] - squareA[0];
        case Direction.Left:
          return squareA[1] - squareB[1];
        case Direction.Right:
          return squareB[1] - squareA[1];
      }
    });

  const directionVectors = {
    [Direction.Up]: [-1, 0],
    [Direction.Down]: [1, 0],
    [Direction.Left]: [0, -1],
    [Direction.Right]: [0, 1],
  };
  for (let index = 0; index < filteredSquares.length; index++) {
    const [y, x] = filteredSquares[index];
    const gridValue = grid[y][x] ?? 0;
    let newY = y;
    let newX = x;
    const [dy, dx] = directionVectors[direction];

    while (
      newY + dy >= 0 &&
      newY + dy < GRID_SIZE &&
      newX + dx >= 0 &&
      newX + dx < GRID_SIZE &&
      grid[newY + dy][newX + dx] === undefined
    ) {
      newY += dy;
      newX += dx;
    }

    grid[y][x] = undefined;
    if (
      newY + dy >= 0 &&
      newY + dy < GRID_SIZE &&
      newX + dx >= 0 &&
      newX + dx < GRID_SIZE &&
      grid[newY + dy][newX + dx] === gridValue
    ) {
      grid[newY + dy][newX + dx] = gridValue * 2;
      scoreToAdd += gridValue * 2;
    } else {
      grid[newY][newX] = gridValue;
    }
  }
  return [scoreToAdd, copyGrid(grid)];
}

function isGameOver(grid: Grid): boolean {
  const [_leftScore, gridLeft] = moveGrid(grid, Direction.Left);
  const [_rightScore, gridRight] = moveGrid(grid, Direction.Right);
  const [_upScore, gridUp] = moveGrid(grid, Direction.Up);
  const [_downScore, gridDown] = moveGrid(grid, Direction.Down);

  return (
    areGridsEqual(grid, gridLeft) &&
    areGridsEqual(grid, gridRight) &&
    areGridsEqual(grid, gridUp) &&
    areGridsEqual(grid, gridDown)
  );
}
