import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001/api", // Adjust the base URL as needed
  headers: {
    "Content-Type": "application/json",
  },
});
export default axiosInstance;
