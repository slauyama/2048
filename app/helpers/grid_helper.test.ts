import { Direction, Grid } from "../types/2048";
import { copyGrid, getSquares, moveGrid } from "./grid_helper";

describe("getSquares", () => {
  let grid: Grid;
  let rowWithMultiple: number[], rowWithSingle: number[];
  beforeEach(() => {
    rowWithMultiple = [2, 4, 4];
    rowWithSingle = [];
    rowWithSingle[1] = 2;
    grid = [rowWithMultiple, [], rowWithSingle, []];
  });

  it("can return all squares that are filled", () => {
    const squares = getSquares(grid, true);

    expect(squares.length).toBe(4);
    const expectedSquares = [
      [0, 0],
      [0, 1],
      [0, 2],
      [2, 1],
    ];
    expectedSquares.forEach((expectedSquare) => {
      expect(squares).toContainEqual(expectedSquare);
    });
  });

  it("can return all squares that are not filled", () => {
    const squares = getSquares(grid, false);
    const squareWithDefaultParam = getSquares(grid);

    expect(squares.length).toBe(12);
    expect(squareWithDefaultParam.length).toBe(12);
    const expectedSquares = [
      [0, 3],
      [1, 0],
      [1, 1],
      [1, 2],
      [1, 3],
      [2, 0],
      [2, 2],
      [2, 3],
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
    ];
    expectedSquares.forEach((expectedSquare) => {
      expect(squares).toContainEqual(expectedSquare);
    });
  });
});

describe("copyGrid", () => {
  let grid: Grid;
  let rowWithMultiple: number[], rowWithSingle: number[];
  beforeEach(() => {
    rowWithMultiple = [2, 4, 4];
    rowWithSingle = [];
    rowWithSingle[1] = 2;
    grid = [rowWithMultiple, [], rowWithSingle, []];
  });

  it("should return copy of grid", () => {
    const newGrid = copyGrid(grid);
    newGrid.forEach((newGridRow, i) => {
      expect(newGridRow).toEqual(grid[i]);
      expect(newGridRow).not.toBe(grid[i]);
    });
  });
});

describe("moveGrid", () => {
  let grid: Grid;
  let rowWithMultiple: number[], rowWithSingle: number[];
  beforeEach(() => {
    rowWithMultiple = [2, 4, 4];
    rowWithSingle = [];
    rowWithSingle[1] = 2;
    grid = [rowWithMultiple, [], rowWithSingle, []];
  });

  describe("left", () => {
    it("should move grid", () => {
      grid = [[], [], rowWithSingle, []];
      const [newScore, newGrid] = moveGrid(grid, Direction.Left);

      const expectedGrid = [[], [], [2, undefined], []];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    it("should move multiple items", () => {
      rowWithMultiple = [];
      rowWithMultiple[1] = 2;
      rowWithMultiple[2] = 4;
      rowWithMultiple[3] = 8;
      grid = [[], [], rowWithMultiple, []];
      const [newScore, newGrid] = moveGrid(grid, Direction.Left);

      const expectedGrid = [[], [], [2, 4, 8, undefined], []];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    it("should not move items on left side", () => {
      grid = [[], [], [2], []];
      const [newScore, newGrid] = moveGrid(grid, Direction.Left);

      const expectedGrid = [[], [], [2], []];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    describe("merging", () => {
      it("should merge items", () => {
        grid = [[], [], [2, 2], []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Left);

        const expectedGrid = [[], [], [4, undefined], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(4);
      });

      it("should move and merge items", () => {
        rowWithMultiple = [];
        rowWithMultiple[1] = 2;
        rowWithMultiple[2] = 2;
        grid = [[], [], rowWithMultiple, []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Left);

        const expectedGrid = [[], [], [4, undefined, undefined], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(4);
      });

      it("should merge items in front and move everything", () => {
        rowWithMultiple = [];
        rowWithMultiple[1] = 4;
        rowWithMultiple[2] = 4;
        rowWithMultiple[3] = 2;
        grid = [[], [], rowWithMultiple, []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Left);

        const expectedGrid = [[], [], [8, 2], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(8);
      });

      it.skip("should not merge twice", () => {
        rowWithMultiple = [];
        rowWithMultiple[1] = 2;
        rowWithMultiple[2] = 2;
        rowWithMultiple[3] = 4;
        grid = [[], [], rowWithMultiple, []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Left);

        const expectedGrid = [[], [], [4, 4], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(8);
      });

      it("should merge items in back", () => {
        rowWithMultiple = [];
        rowWithMultiple[1] = 2;
        rowWithMultiple[2] = 4;
        rowWithMultiple[3] = 4;
        grid = [[], [], rowWithMultiple, []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Left);

        const expectedGrid = [[], [], [2, 8], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(8);
      });
    });
  });

  describe("right", () => {
    it("should move grid", () => {
      grid = [[], [], [2], []];
      const [newScore, newGrid] = moveGrid(grid, Direction.Right);

      const expectedGrid = [[], [], [undefined, undefined, undefined, 2], []];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    it("should move grid", () => {
      grid = [[], [], rowWithSingle, []];
      const [newScore, newGrid] = moveGrid(grid, Direction.Right);

      const expectedGrid = [[], [], [undefined, undefined, undefined, 2], []];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    it("should move multiple items", () => {
      rowWithMultiple = [];
      rowWithMultiple[0] = 2;
      rowWithMultiple[1] = 4;
      rowWithMultiple[2] = 8;
      grid = [[], [], rowWithMultiple, []];
      const [newScore, newGrid] = moveGrid(grid, Direction.Right);

      const expectedGrid = [[], [], [undefined, 2, 4, 8], []];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    it("should not move items on right side", () => {
      grid = [[], [], [undefined, undefined, undefined, 2], []];
      const [newScore, newGrid] = moveGrid(grid, Direction.Right);

      const expectedGrid = [[], [], [undefined, undefined, undefined, 2], []];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    describe("merging", () => {
      it("should merge items", () => {
        grid = [[], [], [undefined, undefined, 2, 2], []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Right);

        const expectedGrid = [[], [], [undefined, undefined, undefined, 4], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(4);
      });

      it("should move and merge items", () => {
        rowWithMultiple = [];
        rowWithMultiple[1] = 2;
        rowWithMultiple[2] = 2;
        grid = [[], [], rowWithMultiple, []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Right);

        const expectedGrid = [[], [], [undefined, undefined, undefined, 4], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(4);
      });

      it("should merge items in front and move everything", () => {
        rowWithMultiple = [];
        rowWithMultiple[0] = 2;
        rowWithMultiple[1] = 4;
        rowWithMultiple[2] = 4;
        grid = [[], [], rowWithMultiple, []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Right);

        const expectedGrid = [[], [], [undefined, undefined, 2, 8], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(8);
      });

      it.skip("should not merge twice", () => {
        rowWithMultiple = [];
        rowWithMultiple[0] = 4;
        rowWithMultiple[1] = 2;
        rowWithMultiple[2] = 2;
        grid = [[], [], rowWithMultiple, []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Right);

        const expectedGrid = [[], [], [undefined, undefined, 4, 4], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(8);
      });

      it("should merge items in back", () => {
        rowWithMultiple = [];
        rowWithMultiple[0] = 4;
        rowWithMultiple[1] = 4;
        rowWithMultiple[2] = 2;
        grid = [[], [], rowWithMultiple, []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Right);

        const expectedGrid = [[], [], [undefined, undefined, 8, 2], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(8);
      });
    });
  });

  describe("up", () => {
    it("should move grid", () => {
      grid = [[], [], rowWithSingle, []];
      const [newScore, newGrid] = moveGrid(grid, Direction.Up);

      const expectedGrid = [[undefined, 2], [], [], []];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    it("should move multiple items", () => {
      grid = [[], [2], [4], [8]];
      const [newScore, newGrid] = moveGrid(grid, Direction.Up);

      const expectedGrid = [[2], [4], [8], []];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    it("should not move items on top side", () => {
      grid = [[2], [], [], []];
      const [newScore, newGrid] = moveGrid(grid, Direction.Up);

      const expectedGrid = [[2], [], [], []];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    describe("merging", () => {
      it("should merge items", () => {
        grid = [[2], [2], [], []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Up);

        const expectedGrid = [[4], [], [], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(4);
      });

      it("should move and merge items", () => {
        grid = [[], [2], [2], []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Up);

        const expectedGrid = [[4], [], [], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(4);
      });

      it("should merge items in front and move everything", () => {
        grid = [[], [2], [2], [8]];
        const [newScore, newGrid] = moveGrid(grid, Direction.Up);

        const expectedGrid = [[4], [8], [], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(4);
      });

      it.skip("should not merge twice", () => {
        grid = [[], [2], [2], [4]];
        const [newScore, newGrid] = moveGrid(grid, Direction.Up);

        const expectedGrid = [[4], [4], [], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(8);
      });

      it("should merge items in back", () => {
        grid = [[], [2], [4], [4]];
        const [newScore, newGrid] = moveGrid(grid, Direction.Up);

        const expectedGrid = [[2], [8], [], []];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(8);
      });
    });
  });

  describe("down", () => {
    it("should move grid", () => {
      grid = [[], [], rowWithSingle, []];
      const [newScore, newGrid] = moveGrid(grid, Direction.Down);

      const expectedGrid = [[], [], [], [undefined, 2]];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    it("should move multiple items", () => {
      grid = [[8], [2], [4], []];
      const [newScore, newGrid] = moveGrid(grid, Direction.Down);

      const expectedGrid = [[], [8], [2], [4]];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    it("should not move items on bottom side", () => {
      grid = [[], [], [], [2]];
      const [newScore, newGrid] = moveGrid(grid, Direction.Down);

      const expectedGrid = [[], [], [], [2]];
      newGrid.forEach((newGridRow, i) => {
        expect(newGridRow).toEqual(expectedGrid[i]);
      });
      expect(newScore).toBe(0);
    });

    describe("merging", () => {
      it("should merge items", () => {
        grid = [[], [], [2], [2]];
        const [newScore, newGrid] = moveGrid(grid, Direction.Down);

        const expectedGrid = [[], [], [], [4]];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(4);
      });

      it("should move and merge items", () => {
        grid = [[], [2], [2], []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Down);

        const expectedGrid = [[], [], [], [4]];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(4);
      });

      it("should merge items in front and move everything", () => {
        grid = [[8], [2], [2], []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Down);

        const expectedGrid = [[], [], [8], [4]];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(4);
      });

      it.skip("should not merge twice", () => {
        grid = [[], [2], [2], [4]];
        const [newScore, newGrid] = moveGrid(grid, Direction.Down);

        const expectedGrid = [[], [], [4], [4]];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(8);
      });

      it("should merge items in back", () => {
        grid = [[4], [4], [2], []];
        const [newScore, newGrid] = moveGrid(grid, Direction.Down);

        const expectedGrid = [[], [], [8], [2]];
        newGrid.forEach((newGridRow, i) => {
          expect(newGridRow).toEqual(expectedGrid[i]);
        });
        expect(newScore).toBe(8);
      });
    });
  });
});
