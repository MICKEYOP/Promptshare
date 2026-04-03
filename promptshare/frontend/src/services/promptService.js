import axios from "axios";

const API_URL = "http://localhost:2000/api/prompts";

/* =====================
   ➕ CREATE PROMPT (WITH IMAGE)
===================== */
export const createPrompt = async (formData, token) => {
  const res = await axios.post(API_URL, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};

/* =====================
   📄 GET ALL PROMPTS
===================== */
export const getAllPrompts = async (
  search = "",
  page = 1,
  limit = 5,
  sort = "newest"
) => {
  const res = await axios.get(API_URL, {
    params: { search, page, limit, sort }
  });
  return res.data;
};

/* =====================
   📄 GET PROMPT BY ID
===================== */
export const getPromptById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

/* =====================
   🗑 DELETE PROMPT
===================== */
export const deletePrompt = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

/* =====================
   ✏️ UPDATE PROMPT
===================== */
export const updatePrompt = async (id, data, token) => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  return res.data;
};

/* =====================
   ❤️ LIKE / UNLIKE PROMPT
===================== */
export const toggleLikePrompt = async (promptId, token) => {
  if (!token) {
    throw new Error("No auth token");
  }

  const res = await axios.post(
    `${API_URL}/${promptId}/like`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};

/* =====================
  ⭐ SAVE / UNSAVE PROMPT
===================== */ 
export const toggleSavePrompt = async (id, token) => {
  const res = await fetch(
    `http://localhost:2000/api/prompts/${id}/save`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`  
      }
    }
  );

  return res.json();
};

/* =====================
   💬 ADD COMMENT
===================== */
export const addComment = async (id, text, token) => {
  const res = await axios.post(
    `${API_URL}/${id}/comments`,
    { text },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};

/* =====================
  image generation using Freepik API
===================== */
export const generateImage = async (prompt) => {
  console.log("Calling backend...");

  const res = await fetch("http://localhost:2000/api/images/search-images", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: prompt }),
  });

  console.log("Response status:", res.status);

  if (!res.ok) {
    const text = await res.text();
    console.log("Error response:", text);
    throw new Error("API failed");
  }

  const data = await res.json();
  console.log("Response data:", data);

  return data;
};