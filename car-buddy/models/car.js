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
  tyreStatus: {
    type: String,
    enum: ["ok", "check", "change"],
    default: "ok"
  },
  tyreDif: String,
  tyreLife: String,
  tyreLifeDif: String,
  fuelType: {
    type: String,
    enum: ["petrol", "diesel"]
  },
  insuranceType: {
    type: String,
    enum: ["yearly", "semiannualy", "quarterly", "monthly"]
  },
  insuranceDate: {
    type: Date
  },
  insurancePaid: {
    type:Boolean,
    default: true
  },
  coolant:String,
  coolantChange:{
    type:Boolean,
    default: false
  },
  coolantDif:String,
  brake:String,
  brakeChange:{
    type:Boolean,
    default: false
  },
  brakeDif:String,
  airFilter:String,
  airFilterChange:{
    type:Boolean,
    default: false
  },
  airFilterDif:String
/*   
  brakeFluid:String,
  brakeFluidChange:{
  type:Boolean,
  default: false
  },
  brakeFluidDif:String, */
});

module.exports = mongoose.model("Car", schema);
