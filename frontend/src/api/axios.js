import axios from "axios";

const api = axios.create({
  baseURL: "https://memoria-backend-av9g.onrender.com/api",
});

export default api;
