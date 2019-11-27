"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  name: String,
  kms: String,
  oil: {
    type: String
  },
  oilChange: {
    type: Boolean,
    
    default: false
  },
  oilDif: String,
  tyrePressure: String,
  tyreChange: {
    type: Boolean,
    
    default: false
  },
  tyreDif: String,
  fuelType: {
    type: String,
    enum: ["petrol", "diesel"]
  },
  insuranceType: {
    type: String,
    enum: ["yearly", "semiannualy", "quarterly", "monthly"]
  },
  insuranceDate: {
    type: String
  }
});

module.exports = mongoose.model("Car", schema);
