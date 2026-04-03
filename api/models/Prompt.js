const mongoose = require("mongoose");

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    promptText: {
      type: String,
      required: true
    },

    description: {
      type: String
    },

    tags: [
      {
        type: String
      }
    ],

    image: {
      type: String
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    views: {
      type: Number,
      default: 0
    },

    // ❤️ LIKES
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // ⭐ SAVED 
    savedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: []
      }
    ],

    // 💬 COMMENTS
    comments: [
      {
        text: {
          type: String,
          required: true
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Prompt", promptSchema);