import axios from "axios";

const API_URL = "http://localhost:2000/api/auth";

// ✅ LOGIN 
export const loginUser = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, {
    email,
    password
  });
  return res.data;
};

// ✅ REGISTER (UPDATED with username)
export const registerUser = async ({ username, email, password }) => {
  const res = await axios.post(`${API_URL}/register`, {
    username,
    email,
    password
  });
  return res.data;
};
