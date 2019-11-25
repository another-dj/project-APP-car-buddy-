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
  hashpassword: {
    type: String,
    required: true
  },
  mycars: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Car"
    }
  ],
  avatar: String
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", schema);
