const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/search-images", async (req, res) => {
  try {
    const { query } = req.body;

    const response = await axios.get(
      "https://api.freepik.com/v1/resources",
      {
        headers: {
          "x-freepik-api-key": process.env.FREEPIK_API_KEY
        },
        params: {
          term: query,
          limit: 8,
          page: 1,
          locale: "en-US"
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: "Image search failed" });
  }
});

module.exports = router;