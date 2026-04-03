const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3
    },
     avatar: {
      type: String, // image path
      default: ""
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    totalLikes: {
  type: Number,
  default: 0
},

isTopCreator: {
  type: Boolean,
  default: false
},

joinedAt: {
  type: Date,
  default: Date.now
},

discordId: {
  type: String,
  default: ""
},

about: {
  type: String,
  default: ""
},

    // 👍 LIKES FEATURE
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    savedPrompts: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prompt"
      }
    ],
    followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ],

  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  ]
  },
  { timestamps: true }
);



module.exports = mongoose.model("User", accountSchema);
