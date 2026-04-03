import axios from "axios";

const API_URL = "http://localhost:2000/api/users";

// ⭐ Save / Unsave
export const toggleSavePrompt = async (id, token) => {
  const res = await axios.post(
    `${API_URL}/save/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};

// ⭐ Get Saved Prompts
export const getSavedPrompts = async (token) => {
  const res = await axios.get(`${API_URL}/saved`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const getMyPrompts = async (token) => {
  const res = await axios.get(`${API_URL}/my-prompts`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

export const updateProfile = async (data, token) => {
  const res = await axios.put(`${API_URL}/profile`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data; // { message, user }
};

export const updateAvatar = async (file, token) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await axios.put(
    `${API_URL}/profile/avatar`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return res.data;
};

export const getProfileStats = async (days, token) => {
  const res = await axios.get(
    `http://localhost:2000/api/users/analytics?days=${days}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};

export const toggleFollow = async (userId, token) => {
  const res = await axios.post(
    `http://localhost:2000/api/users/follow/${userId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
};

export const getPublicProfile = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};
