const {Schema, model} = require('mongoose')

const Applications = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    application_latter: String,
    time: String,
    day_off: String,
    supervayzer: String,
    sent: {
        type: Boolean,
        default: false
    },
    // action: String, 
    admin_confirmation: {
        type: Boolean,
        default: false
    },
    createdAt: Date
})

module.exports = model('Applications',Applications)