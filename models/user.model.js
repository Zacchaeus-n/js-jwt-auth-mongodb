const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: String,
    spiritualName: String,
    dateOfBirth: String,
    email: String,
    password: String,
    country: String,
    zone: String,
    location: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ]
  })
);

module.exports = User;