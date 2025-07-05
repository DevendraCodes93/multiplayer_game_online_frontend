"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import useGameStore from "../stores/gameStore.js";
import { useRouter } from "next/navigation";

const calculateWinner = (squares) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const TicTacToe = () => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [squares, setSquares] = useState(Array(9).fill(""));
  const [xIsNext, setXIsNext] = useState(true);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const router = useRouter();
  const [showId, setShowId] = useState(false);
  const winner = calculateWinner(squares);
  const isDraw = squares.every(Boolean) && !winner;

  const {
    setPlayerName,
    createRoom,
    gameId,
    roomCreated,
    connectSocket,
    joinRoom,
    createdRoomId,
    roomJoined,
  } = useGameStore();

  useEffect(() => {
    if (gameId == null) return;
    router.push(`/game/${gameId}`);
  }, [gameId]);
  useEffect(() => {
    connectSocket();
    roomCreated();
    roomJoined();
  }, []);

  useEffect(() => {
    if (winner) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [winner]);

  const makeMove = (i) => {
    if (squares[i] || winner) return;
    const nextSquares = [...squares];
    nextSquares[i] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const restartGame = () => {
    setSquares(Array(9).fill(""));
    setXIsNext(true);
  };

  const status = winner
    ? `🏆 Winner: ${winner}`
    : isDraw
    ? "🤝 It's a draw!"
    : `🔁 Next: ${xIsNext ? "X" : "O"}`;

  const handleCreateSubmit = () => {
    if (!name.trim()) return alert("Please enter your name.");
    setPlayerName(name);
    createRoom(name);
    setCreateModalOpen(false);
    setName("");
  };

  const handleJoinSubmit = () => {
    if (!name.trim() || !roomId.trim()) return alert("Fill in all fields.");
    joinRoom(name, roomId);

    console.log("Joining room:", roomId, "as", name);
    setJoinModalOpen(false);
    setName("");
    setRoomId("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900 flex flex-col items-center justify-center px-6 py-12">
      {" "}
      {createdRoomId && (
        <motion.div
          className="flex flex-col items-center justify-center text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <button
            onClick={() => setShowId((prev) => !prev)}
            className="text-xl sm:text-6xl font-light text-white mb-2 tracking-tight flex items-center gap-2 cursor-pointer focus:outline-none"
          >
            1 Room created
            <motion.span
              animate={{ rotate: showId ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-white text-xl sm:text-3xl"
            >
              ▼
            </motion.span>
          </button>

          {showId && (
            <div className="text-blue-400 text-lg sm:text-2xl font-mono">
              {createdRoomId}
            </div>
          )}
        </motion.div>
      )}
      <motion.h1
        className="text-5xl sm:text-6xl font-light text-white mb-2 tracking-tight"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Tic Tac Toe
      </motion.h1>
      <motion.div
        className="text-lg sm:text-xl font-medium text-gray-300 mb-8 tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {status}
      </motion.div>
      <div className="grid grid-cols-3 gap-4 mb-8 p-6 bg-black/20 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/30">
        {squares.map((value, i) => (
          <motion.button
            key={i}
            onClick={() => makeMove(i)}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-800/60 backdrop-blur-sm border border-gray-600/40 rounded-2xl text-3xl sm:text-4xl font-light shadow-lg hover:bg-gray-700/80 transition-all duration-300 flex items-center justify-center text-white"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
          >
            {value}
          </motion.button>
        ))}
      </div>
      <div className="flex gap-4 flex-wrap justify-center">
        <motion.button
          onClick={restartGame}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-2xl bg-gray-700/90 backdrop-blur-sm text-white font-medium shadow-lg hover:bg-gray-600/90 transition-all duration-300 border border-gray-600/20"
        >
          🔄 Restart
        </motion.button>
        <motion.button
          onClick={() => setCreateModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-2xl bg-blue-600/90 backdrop-blur-sm text-white font-medium shadow-lg hover:bg-blue-500/90 transition-all duration-300 border border-blue-500/20"
        >
          🎮 Create Room
        </motion.button>
        <motion.button
          onClick={() => setJoinModalOpen(true)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-2xl bg-purple-600/90 backdrop-blur-sm text-white font-medium shadow-lg hover:bg-purple-500/90 transition-all duration-300 border border-purple-500/20"
        >
          🔗 Join Room
        </motion.button>
      </div>
      {/* Modal Reuse */}
      <AnimatePresence>
        {(isCreateModalOpen || isJoinModalOpen) && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800/90 backdrop-blur-xl text-white rounded-3xl p-8 w-[90%] max-w-md shadow-2xl border border-gray-700/50"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-2xl font-light mb-6 text-center text-gray-100">
                {isCreateModalOpen ? "Create Room" : "Join Room"}
              </h2>
              <input
                placeholder="Enter your name"
                className="w-full px-4 py-3 mb-4 border border-gray-600 rounded-2xl bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-white placeholder-gray-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {isJoinModalOpen && (
                <input
                  placeholder="Enter room ID"
                  className="w-full px-4 py-3 mb-4 border border-gray-600 rounded-2xl bg-gray-700/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent text-white placeholder-gray-400"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                />
              )}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setCreateModalOpen(false);
                    setJoinModalOpen(false);
                  }}
                  className="px-5 py-2 bg-gray-600 text-gray-200 rounded-2xl hover:bg-gray-500 transition-all duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  className="px-5 py-2 bg-blue-600/90 backdrop-blur-sm text-white rounded-2xl hover:bg-blue-500/90 transition-all duration-300 font-medium shadow-lg"
                  onClick={
                    isCreateModalOpen ? handleCreateSubmit : handleJoinSubmit
                  }
                >
                  ✅ {isCreateModalOpen ? "Create" : "Join"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TicTacToe;
