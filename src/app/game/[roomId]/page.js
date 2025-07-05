"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import useGameStore from "../../../stores/gameStore.js";
import { useParams } from "next/navigation";

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
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
};

// Sad particles configuration with red particles
const sadParticlesConfig = {
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 120,
  particles: {
    color: {
      value: ["#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"], // Red particles for sadness
    },
    links: {
      enable: false,
    },
    move: {
      direction: "bottom",
      enable: true,
      outModes: {
        default: "out",
      },
      random: true,
      speed: { min: 0.5, max: 2 },
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 40, // Reduced number
    },
    opacity: {
      value: { min: 0.3, max: 0.7 },
      animation: {
        enable: true,
        speed: 1.5,
        minimumValue: 0.1,
      },
    },
    shape: {
      type: ["circle", "square"],
    },
    size: {
      value: { min: 1, max: 3 },
      animation: {
        enable: true,
        speed: 2,
        minimumValue: 0.5,
      },
    },
  },
  detectRetina: true,
};

// Sad emoji particles configuration for extra sadness
const sadEmojiParticlesConfig = {
  background: {
    color: {
      value: "transparent",
    },
  },
  fpsLimit: 60,
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      enable: false,
    },
    move: {
      direction: "bottom",
      enable: true,
      outModes: {
        default: "out",
      },
      random: true,
      speed: { min: 1, max: 3 },
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 1200,
      },
      value: 15,
    },
    opacity: {
      value: { min: 0.6, max: 0.9 },
      animation: {
        enable: true,
        speed: 0.5,
        minimumValue: 0.3,
      },
    },
    shape: {
      type: "char",
      character: {
        value: ["😢", "😭", "💔", "😔", "😞"],
        font: "Arial",
        style: "",
        weight: "400",
      },
    },
    size: {
      value: { min: 20, max: 30 },
      animation: {
        enable: true,
        speed: 1,
        minimumValue: 15,
      },
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: "random",
      animation: {
        enable: true,
        speed: 2,
      },
    },
  },
  detectRetina: true,
};

const VSPage = () => {
  const {
    connectSocket,
    listenToMoves,
    makeMoveOnServer,
    gameCurrentState,
    gameData,
    resetGame,
    responseResetGame,
  } = useGameStore();

  const params = useParams();
  const roomId = params.roomId;

  const [squares, setSquares] = useState(Array(9).fill(""));
  const [socketId, setSocketId] = useState(null);
  const [xIsNext, setXIsNext] = useState(true);
  const [vibrateTurn, setVibrateTurn] = useState(false);
  const [loserTriggered, setLoserTriggered] = useState(false);
  const [showSadEnvironment, setShowSadEnvironment] = useState(false);

  const { winner, line: winningLine } = calculateWinner(squares);
  const isDraw = squares.every(Boolean) && !winner;

  const players = gameData?.players || [];
  const xPlayer = players[0];
  const oPlayer = players[1];

  const currentPlayer = xIsNext ? xPlayer : oPlayer;
  const winnerPlayer = winner ? (winner === "X" ? xPlayer : oPlayer) : null;
  const loserPlayer = winner ? (winner === "X" ? oPlayer : xPlayer) : null;

  const isMyTurn =
    (xIsNext && socketId === xPlayer?.id) ||
    (!xIsNext && socketId === oPlayer?.id);

  // Check if current player is the loser
  const amITheLoser = winner && loserPlayer && socketId === loserPlayer.id;

  // Initialize particles
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  useEffect(() => {
    connectSocket();
    listenToMoves();
    responseResetGame();

    const interval = setInterval(() => {
      const socket = useGameStore.getState().socket;
      if (socket?.id) {
        setSocketId(socket.id);
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [connectSocket, listenToMoves, responseResetGame]);

  useEffect(() => {
    if (gameCurrentState) {
      setSquares(gameCurrentState.squares);
      setXIsNext(gameCurrentState.xTurn);
    }
  }, [gameCurrentState]);

  useEffect(() => {
    if (winner && socketId) {
      const loser = winner === "X" ? oPlayer : xPlayer;
      const winnerPlayer = winner === "X" ? xPlayer : oPlayer;

      // Check if I am the winner or loser
      const amITheWinner = winnerPlayer?.id === socketId;
      const amITheLoser = loser?.id === socketId;

      // Celebration confetti ONLY for the winning player
      if (amITheWinner && !loserTriggered) {
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.6 },
          colors: ["#60A5FA", "#A78BFA", "#F59E0B", "#10B981", "#F59E0B"],
        });

        // Extra celebration bursts for winner
        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#FFD700", "#FFA500", "#FF6347"],
          });
        }, 200);

        setTimeout(() => {
          confetti({
            particleCount: 100,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#FFD700", "#FFA500", "#FF6347"],
          });
        }, 400);
      }

      // Sad environment ONLY for the losing player
      if (amITheLoser && !loserTriggered) {
        setTimeout(() => {
          setShowSadEnvironment(true);
          setIsLoser(true);

          // Play a subtle sad sound using Web Audio API
          if (typeof window !== "undefined") {
            try {
              const audioContext = new (window.AudioContext ||
                window.webkitAudioContext)();
              const oscillator = audioContext.createOscillator();
              const gainNode = audioContext.createGain();

              oscillator.connect(gainNode);
              gainNode.connect(audioContext.destination);

              oscillator.frequency.setValueAtTime(
                220,
                audioContext.currentTime
              );
              oscillator.frequency.exponentialRampToValueAtTime(
                110,
                audioContext.currentTime + 1
              );

              gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
              gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 1
              );

              oscillator.start();
              oscillator.stop(audioContext.currentTime + 1);
            } catch {
              console.log("Audio not supported");
            }
          }
        }, 300); // delay slightly to let board settle visually
      }

      setLoserTriggered(true);
    } else {
      setLoserTriggered(false);
      setShowSadEnvironment(false);
    }
  }, [winner, socketId, loserTriggered, oPlayer, xPlayer]);

  const makeMove = (i) => {
    if (winner || squares[i]) return;

    if (!isMyTurn) {
      setVibrateTurn(true);
      setTimeout(() => setVibrateTurn(false), 400);

      if (typeof window !== "undefined" && window.navigator.vibrate) {
        window.navigator.vibrate(100);
      }

      return;
    }

    const next = [...squares];
    next[i] = xIsNext ? "X" : "O";
    setSquares(next);
    setXIsNext(!xIsNext);
    makeMoveOnServer(i);
  };

  return (
    <div
      className={`min-h-screen w-full ${
        amITheLoser
          ? "bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950"
          : "bg-gradient-to-br from-slate-900 via-gray-900 to-zinc-900"
      } flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden`}
    >
      {/* Sad Environment Particles - Only for the losing player */}
      {amITheLoser && showSadEnvironment && (
        <>
          <div className="fixed inset-0 pointer-events-none z-10">
            <Particles
              id="sad-particles"
              init={particlesInit}
              options={sadParticlesConfig}
            />
          </div>
          <div className="fixed inset-0 pointer-events-none z-10">
            <Particles
              id="sad-emoji-particles"
              init={particlesInit}
              options={sadEmojiParticlesConfig}
            />
          </div>
          {/* Dark overlay for losing player */}
          <motion.div
            className="fixed inset-0 bg-black/40 pointer-events-none z-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
          />
        </>
      )}

      <motion.div
        className={`flex items-center justify-center mb-8 w-full max-w-4xl relative z-20 ${
          amITheLoser ? "filter brightness-75" : ""
        }`}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          className={`flex flex-col items-center px-5 py-4 rounded-2xl backdrop-blur-sm border ${
            xIsNext
              ? "bg-blue-600/20 border-blue-500/50"
              : "bg-gray-800/40 border-gray-600/30"
          } transition-all duration-300 ${
            amITheLoser && loserPlayer?.id === xPlayer?.id
              ? "filter brightness-50 saturate-50"
              : ""
          }`}
          whileHover={{ scale: 1.02 }}
          animate={
            amITheLoser && loserPlayer?.id === xPlayer?.id
              ? {
                  y: [0, -2, 2, -1, 1, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                }
              : {}
          }
        >
          <div
            className={`w-16 h-16 ${
              amITheLoser && loserPlayer?.id === xPlayer?.id
                ? "bg-red-500"
                : "bg-blue-500"
            } rounded-full flex items-center justify-center mb-3 shadow-lg`}
          >
            <span className="text-2xl font-bold text-white">
              {amITheLoser && loserPlayer?.id === xPlayer?.id ? "😢" : "X"}
            </span>
          </div>
          <h3 className="text-xl font-medium text-white">
            {xPlayer?.name || "Player X"}
          </h3>
          <p
            className={`text-sm ${
              amITheLoser && loserPlayer?.id === xPlayer?.id
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {amITheLoser && loserPlayer?.id === xPlayer?.id
              ? "Lost"
              : "Player 1"}
          </p>
        </motion.div>

        <motion.div
          className="mx-8 flex flex-col items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl"
            animate={{
              boxShadow: [
                "0 0 20px rgba(239, 68, 68, 0.5)",
                "0 0 40px rgba(249, 115, 22, 0.8)",
                "0 0 20px rgba(239, 68, 68, 0.5)",
              ],
            }}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <span className="text-3xl font-black text-white">VS</span>
          </motion.div>
          <motion.p
            className="text-gray-300 text-sm mt-2 font-medium tracking-wider"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            BATTLE
          </motion.p>
        </motion.div>

        <motion.div
          className={`flex flex-col items-center px-6 py-4 rounded-2xl backdrop-blur-sm border ${
            !xIsNext
              ? "bg-purple-600/20 border-purple-500/50"
              : "bg-gray-800/40 border-gray-600/30"
          } transition-all duration-300 ${
            amITheLoser && loserPlayer?.id === oPlayer?.id
              ? "filter brightness-50 saturate-50"
              : ""
          }`}
          whileHover={{ scale: 1.02 }}
          animate={
            amITheLoser && loserPlayer?.id === oPlayer?.id
              ? {
                  y: [0, -2, 2, -1, 1, 0],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  },
                }
              : {}
          }
        >
          <div
            className={`w-16 h-16 ${
              amITheLoser && loserPlayer?.id === oPlayer?.id
                ? "bg-red-500"
                : "bg-purple-500"
            } rounded-full flex items-center justify-center mb-3 shadow-lg`}
          >
            <span className="text-2xl font-bold text-white">
              {amITheLoser && loserPlayer?.id === oPlayer?.id ? "😢" : "O"}
            </span>
          </div>
          <h3 className="text-xl font-medium text-white">
            {oPlayer?.name || "Player O"}
          </h3>
          <p
            className={`text-sm ${
              amITheLoser && loserPlayer?.id === oPlayer?.id
                ? "text-red-400"
                : "text-gray-400"
            }`}
          >
            {amITheLoser && loserPlayer?.id === oPlayer?.id
              ? "Lost"
              : "Player 2"}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        className={`text-lg sm:text-xl font-medium text-gray-300 mb-8 tracking-wide text-center relative z-20 ${
          amITheLoser ? "filter brightness-75" : ""
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {winner ? (
          <div className="flex items-center gap-2">
            {amITheLoser ? (
              <>
                <motion.span
                  className="text-2xl"
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 0.9, 1.1, 0.9, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                >
                  😞
                </motion.span>
                <span className="text-red-400 font-semibold">
                  You Lost... Better luck next time!
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl">🏆</span>
                <span className="text-yellow-400 font-semibold">
                  {winnerPlayer?.name || "Someone"} Wins!
                </span>
              </>
            )}
          </div>
        ) : isDraw ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤝</span>
            <span className="text-blue-400">It&apos;s a Draw!</span>
          </div>
        ) : (
          <motion.div
            className="flex items-center gap-2"
            animate={vibrateTurn ? { x: [-6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              ⚡
            </motion.span>
            <span className="text-green-400">
              {currentPlayer?.name || "Player"}&apos;s Turn
            </span>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className={`grid grid-cols-3 gap-4 mb-8 p-6 bg-black/20 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-700/30 relative z-20 ${
          amITheLoser ? "filter brightness-75 saturate-50" : ""
        }`}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, type: "spring" }}
      >
        {squares.map((value, i) => {
          const isBlocked = !isMyTurn || squares[i] || winner;

          return (
            <motion.button
              key={i}
              onClick={() => makeMove(i)}
              whileHover={!isBlocked ? { scale: 1.05 } : {}}
              whileTap={!isBlocked ? { scale: 0.95 } : {}}
              className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl text-3xl sm:text-4xl font-bold flex items-center justify-center shadow-lg transition-all duration-300 border border-gray-600/40 backdrop-blur-sm ${
                isBlocked
                  ? "bg-gray-700/50 opacity-60 cursor-not-allowed"
                  : "bg-gray-800/60 hover:bg-gray-700/80 cursor-pointer"
              }`}
              style={{
                color:
                  value === "X"
                    ? "#60A5FA"
                    : value === "O"
                    ? "#A78BFA"
                    : "#fff",
              }}
            >
              {value}
              {winner && winningLine?.includes(i) && (
                <motion.div
                  layoutId="winning-line"
                  className="absolute inset-0 rounded-xl border-[3px] border-blue-400"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <motion.button
        onClick={resetGame}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`px-6 py-3 rounded-2xl bg-gray-700/90 backdrop-blur-sm text-white font-medium shadow-lg hover:bg-gray-600/90 transition-all duration-300 border border-gray-600/20 relative z-20 ${
          amITheLoser ? "filter brightness-75" : ""
        }`}
      >
        🔄 Restart
      </motion.button>
      <motion.div
        className={`text-center text-gray-400 text-sm mt-2 relative z-20 ${
          amITheLoser ? "filter brightness-75" : ""
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Room ID: <span className="text-blue-400 font-mono">{roomId}</span>
      </motion.div>
    </div>
  );
};

export default VSPage;
