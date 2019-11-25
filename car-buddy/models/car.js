'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObectId,
    ref: 'User'
  },
  oil: {
    type:Boolean
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel'],
  },
  insuranceType: {
    type: String,
    enum: ['Anual', 'semestral', 'trimestral', 'monthly'],
  },
  insuranceDate: {
    type: Date
  }
});

module.exports = mongoose.model('Car', schema);