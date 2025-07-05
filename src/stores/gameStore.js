import { create } from "zustand";
import { io } from "socket.io-client";
const BASE_URL = "https://gridwars-five.vercel.app";
const useGameStore = create((set, get) => ({
  socket: null,
  gameId: null,
  playerName: "",
  createdRoomId: null,
  gameData: null,
  playerSocketId: "",
  gameCurrentState: {
    squares: Array(9).fill(null),
    xTurn: true,
    winner: null,
    isDraw: false,
  },
  setPlayerName: (playerName) => set({ playerName }),
  setPlayerSocketId: (playerSocketId) => set({ playerSocketId }),

  connectSocket: () => {
    if (get().socket?.connected) return;
    const socket = io(BASE_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });
    socket.connect();
    set({ socket });
  },
  disconnectSocket: () => {
    const socket = get().socket;

    console.log("DISCONNECT called, socket:", socket);

    socket.disconnect();

    set({ socket: null });
  },
  createRoom: (name) => {
    const socket = get().socket;
    console.log(socket);
    if (!socket) {
      console.error("Socket is not connected");
      return;
    }
    //6 digit random number
    const roomId = Math.floor(100000 + Math.random() * 900000).toString();
    set({ createdRoomId: roomId });
    socket.emit("create-room", { name, socketId: get().socket.id, roomId });
  },
  roomCreated: () => {
    const socket = get().socket;
    if (!socket) {
      console.error("Socket is not connected");
      return;
    }
    socket.on("room-created", (data) => {
      console.log("Room created:", data);
    });
  },
  joinRoom: (name, roomId) => {
    const socket = get().socket;
    if (!socket) {
      console.error("Socket is not connected");
      return;
    }
    socket.emit("join-room", { name, roomId, socketId: get().socket.id });
    get().roomJoined();
  },
  roomJoined: () => {
    const socket = get().socket;
    if (!socket) {
      console.error("Socket is not connected");
      return;
    }
    socket.on("room-joined", (data) => {
      set({ gameData: data });
      set({ gameId: data.roomId });
      set({ playerSocketId: data.socketId });

      console.log("Room joined:", data);
    });
  },
  makeMoveOnServer: (index) => {
    const { gameCurrentState, socket } = get();
    if (!socket) return;

    const { squares, xTurn, winner, isDraw } = gameCurrentState;

    if (squares[index] || winner || isDraw) return;

    const newSquares = [...squares];
    newSquares[index] = xTurn ? "X" : "O";

    const newGameState = {
      squares: newSquares,
      xTurn: !xTurn,
    };

    socket.emit("make-move", {
      index,
      gameId: get().gameId,
      gameState: newGameState,
    });
  },
  listenToMoves: () => {
    const socket = get().socket;
    if (!socket) {
      console.error("Socket is not connected");
      return;
    }
    socket.on("move-made", ({ index, gameState }) => {
      console.log("Move made:", index, "Game State:", gameState);
      set((state) => ({
        gameCurrentState: {
          ...state.gameCurrentState,
          squares: gameState.squares,
          xTurn: gameState.xTurn,
        },
      }));
    });
  },
  resetGame: () => {
    const socket = get().socket;
    if (!socket) {
      console.error("Socket is not connected");
      return;
    }
    set({
      gameCurrentState: {
        squares: Array(9).fill(null),
        xTurn: true,
        winner: null,
        isDraw: false,
      },
    });

    socket.emit("restart-game", { gameId: get().gameId });
    get.responseResetGame();
  },
  responseResetGame: () => {
    const socket = get().socket;

    socket.on("game-restarted", (data) => {
      console.log("came");
      set({
        gameCurrentState: {
          squares: Array(9).fill(null),
          xTurn: true,
          winner: null,
          isDraw: false,
        },
      });
      console.log("Game has been reset");
    });
  },
}));

export default useGameStore;
