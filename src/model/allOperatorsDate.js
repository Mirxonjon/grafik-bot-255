const {Schema, model} = require('mongoose')

const allOperatorsDate = new Schema({

    idNumber: String,
    full_name : String,
    number1 : String,
    number2 : String,
    createdAt: Date
})

module.exports = model('allOperatorsDate', allOperatorsDate)