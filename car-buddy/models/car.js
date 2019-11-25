'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  name: String,
  kms: String,
  oil: {
    type:Boolean
  },
  fuelType: {
    type: String,
    enum: ['petrol', 'diesel'],
  },
  insuranceType: {
    type: String,
    enum: ['yearly', 'semiannual', 'quarterly', 'monthly'],
  },
  insuranceDate: {
    type: Date
  }
});

module.exports = mongoose.model('Car', schema);