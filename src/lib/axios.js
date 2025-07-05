import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "https://gridwars-five.vercel.app/api", // Adjust the base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosInstance;
