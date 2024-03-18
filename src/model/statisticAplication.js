const {Schema, model} = require('mongoose')

const StatisticApplications = new Schema({
    full_name: String,
    number: String,
    sharePhone: String,
    requestCount:{
        type : Number,
        default : 0
    },
    application_latter: String,
    time: String,
    day_off: String,
    sentdata: String,
    admin_confirmation: String,
    createdAt: Date
})

module.exports = model('StatisticApplications',StatisticApplications)