const mongoose = require('mongoose');

// User Schema definition
const UserSchema = new mongoose.Schema(
  {
    username: { type: String},
    email: { type: String},
    password: { type: String },
    role : { type: String, default: "user" },
    github: { type: String },
    linkedIn: { type: String},
    profilePic: { type: String},
  },
  { timestamps: true }
);

const users = mongoose.model('users',UserSchema)
module.exports = users;
