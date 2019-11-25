'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObectId,
    ref: 'User'
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
  },
  iucDate: Date,
  notes: String,
});

module.exports = mongoose.model('Car', schema);