const mongoose = require("mongoose");

const user = mongoose.Schema({
  username: String,
  password: String,
  email: { type: String, unique: true },
})

const users = new mongoose.model("user", user);

module.exports = users;