"use client";

import { useState, useEffect, useRef } from "react";
import { copyGrid, getSquares, moveGrid } from "../helpers/grid_helper";
import { Direction, Grid } from "../types/2048";
import { SlotsText } from "./slots_text";
import { useLocalStorage } from "../hooks/use_local_storage";
import { GRID_SIZE, TEXT_COLOR_MAP } from "../constants";

function GameSquare({ number }: { number?: number }) {
  let textSize = "text-5xl sm:text-6xl";
  if (number && number > 512) {
    textSize = "text-3xl sm:text-4xl";
  } else if (number && number > 64) {
    textSize = "text-4xl sm:text-5xl";
  }
  const textColor =
    (number !== undefined && TEXT_COLOR_MAP[number]) ?? "text-white";
  return (
    <div
      className={`h-20 w-20 sm:h-28 sm:w-28 border-4 sm:border-8 border-slate-800 bg-slate-700 ${textColor} font-sans font-bold flex items-center justify-center ${textSize}`}
    >
      {number?.toString() ?? ""}
    </div>
  );
}

function GameRow({ numbers }: { numbers: Array<number | undefined> }) {
  return (
    <div className="flex border-slate-800">
      <GameSquare number={numbers[0]} />
      <GameSquare number={numbers[1]} />
      <GameSquare number={numbers[2]} />
      <GameSquare number={numbers[3]} />
    </div>
  );
}

export function Game() {
  const [highScore, setHighScore] = useLocalStorage<number>("highScore", 0);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState<Grid>([[], [], [], []]);
  const gridRef = useRef(grid);
  const [gameOver, setGameOver] = useState(false);
  const [startCoordinates, setStartCoordinates] = useState<{
    x: number | null;
    y: number | null;
  }>({
    x: null,
    y: null,
  });

  function resetBoard() {
    const grid: Grid = [[], [], [], []];

    const fillValue = Math.random() < 0.9 ? 2 : 4;
    const randX = Math.floor(Math.random() * GRID_SIZE);
    const randY = Math.floor(Math.random() * GRID_SIZE);
    grid[randX][randY] = fillValue;
    setGrid(grid);
  }

  function fillEmptySquare(grid: Grid) {
    const emptySquares = getSquares(grid);

    if (emptySquares.length === 0) {
      setGameOver(true);
      return;
    }

    const index = Math.floor(Math.random() * emptySquares.length);
    const emptySquare = emptySquares[index];

    const fillValue = Math.random() < 0.9 ? 2 : 4;

    const newGrid = copyGrid(grid);
    newGrid[emptySquare[0]][emptySquare[1]] = fillValue;
    setGrid([...newGrid]);
  }

  useEffect(() => {
    gridRef.current = grid;
  }, [grid]);

  useEffect(() => {
    if (highScore && score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]);

  useEffect(() => {
    resetBoard();
  }, []);

  function onMoveGrid(direction: Direction) {
    const [newScore, newGrid] = moveGrid(grid, direction);
    setScore(score + newScore);
    setGrid(newGrid);
    fillEmptySquare(grid);
  }

  useEffect(() => {
    function onKeyPress(event: KeyboardEvent) {
      switch (event.code) {
        case Direction.Right:
        case Direction.Left:
        case Direction.Down:
        case Direction.Up:
          onMoveGrid(event.code);
        default:
          return;
      }
    }

    function onTouchMove(event: TouchEvent) {
      event.preventDefault();
    }

    window.addEventListener("keydown", onKeyPress);
    window.addEventListener("touchmove", onTouchMove);

    return () => {
      window.removeEventListener("keydown", onKeyPress);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [onMoveGrid]);

  function onClickNewGame() {
    setScore(0);
    resetBoard();
  }

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const { clientX: x, clientY: y } = event.touches[0];
    setStartCoordinates({ x, y });
  }

  function onTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    event.preventDefault();

    const THRESHOLD = 20;

    const { clientX, clientY } = event.touches[0];
    if (startCoordinates.x !== null && startCoordinates.y !== null) {
      const diffX = clientX - startCoordinates.x;
      const diffY = clientY - startCoordinates.y;

      if (Math.abs(diffX) > THRESHOLD || Math.abs(diffY) > THRESHOLD) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          onMoveGrid(diffX > 0 ? Direction.Right : Direction.Left);
        } else {
          onMoveGrid(diffY > 0 ? Direction.Down : Direction.Up);
        }

        setStartCoordinates({ x: null, y: null });
      }
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-0 sm:justify-between sm:items-center">
        <div className="flex gap-2">
          <div className="flex flex-col min-h-16 items-center w-32 rounded p-1 bg-slate-800">
            <p className="text-lg text-slate-400 font-bold">Score</p>
            <SlotsText
              number={score}
              textClasses="text-xl text-slate-300 font-bold"
            />
          </div>
          <div className="flex flex-col min-h-16 items-center w-32 rounded p-1 bg-slate-800">
            <p className="text-lg text-slate-400 font-bold">High Score</p>
            <SlotsText
              number={Number(highScore)}
              textClasses="text-xl text-slate-300 font-bold"
            />
          </div>
        </div>
        <button
          className="text-md text-slate-300 font-bold rounded-md bg-slate-800 h-10 px-4 py-0 border border-transparent text-center transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none"
          type="button"
          onClick={onClickNewGame}
        >
          New Game
        </button>
      </div>
      <div className="flex justify-center">
        <div
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          className="rounded-md border-4 sm:border-8 border-slate-800"
        >
          <GameRow numbers={grid[0]} />
          <GameRow numbers={grid[1]} />
          <GameRow numbers={grid[2]} />
          <GameRow numbers={grid[3]} />
        </div>
      </div>
    </div>
  );
}
