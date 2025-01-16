const {Schema, model} = require('mongoose')

const allOperatorsDate = new Schema({
  idNumberLogin: String,
  idNumber: String,
  full_name: String,
  login: String,
  number1: String,
  number2: String,

  createdAt: Date,
});

module.exports = model('allOperatorsDate', allOperatorsDate)