"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  /* mycars: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Car"
    }
  ], */
  status: {
    type: String,
    enum: ["pending confirmation", "active"],
    default: "pending confirmation"
  },
  confirmationCode: {
    type: String,
    required: true,
    unique: true
  },
  avatar: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", schema);
