import axios from "axios";

const api = axios.create({
  baseURL: "https://inventory-system-sw0v.onrender.com"
});

export default api;
