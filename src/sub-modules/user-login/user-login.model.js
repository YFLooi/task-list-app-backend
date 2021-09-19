const mongoose = require("mongoose");

const userLoginSchema = new mongoose.Schema(
  {
    username: { type: String },
    password: { type: String },
    profileImageLink: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("user-logins", userLoginSchema, "user-logins");
