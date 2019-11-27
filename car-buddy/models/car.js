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
  oilStatus: {
    type: String,
    enum: ["ok", "nok"],
    default: "ok"
  },
  tyrePressure: String,
  tyreStatus: {
    type: String,
    enum: ["ok", "nok"],
    default: "ok"
  },
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
