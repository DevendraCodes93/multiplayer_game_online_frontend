"use client";
import React from "react";
import Square, { SquareProps } from "./Square";

interface BoardProps {
  squares: (string | null)[];
  onClick: (i: number) => void;
  winningLine?: number[] | null;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winningLine }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {squares.map((square, i) => (
        <Square
          key={i}
          value={square}
          onClick={() => onClick(i)}
          highlight={!!winningLine && winningLine.includes(i)}
        />
      ))}
    </div>
  );
};

export default Board;
