import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://multiplayer-game-backend-swjz.onrender.com/api", // Adjust the base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosInstance;
