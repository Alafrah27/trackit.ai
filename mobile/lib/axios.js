import axios from "axios";

const Instance = axios.create({
  baseURL: `${process.env.EXPO_PUBLIC_API_URL}`,
  timeout: 20000, // Increased timeout; 1000ms is very short for a free Render instance
  headers: { "Content-Type": "application/json" },
});

export default Instance;
