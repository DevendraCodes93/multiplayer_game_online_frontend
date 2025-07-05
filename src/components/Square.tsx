"use client";
import React from "react";

export interface SquareProps {
  value: string | null;
  onClick: () => void;
  highlight?: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, highlight }) => {
  return (
    <button
      className={`w-24 h-24 bg-gradient-to-br from-white to-blue-100 border-4 border-blue-300 text-4xl font-extrabold flex items-center justify-center shadow-xl transition-all duration-200 rounded-2xl hover:scale-105 focus:scale-105 focus:outline-none ${
        highlight ? "animate-pulse border-yellow-400 bg-yellow-100" : ""
      }`}
      onClick={onClick}
    >
      <span
        className={`transition-colors duration-200 ${
          value === "X" ? "text-blue-600" : value === "O" ? "text-pink-500" : ""
        }`}
      >
        {value}
      </span>
    </button>
  );
};

export default Square;
