const {Schema, model} = require('mongoose')

const User = new Schema({
    IdNumber: String,
    full_name: String,
    chatId: Number,
    phone: String,
    phone2: String,
    sharePhone: String,
    admin: {
        type: Boolean,
        default: false
    },
    action: String, 
    requestCount:{
        type : Number,
        default : 0
    },
    messageCount:{
        type : Number,
        default : 0
    },
    lastMessageAdmin : String,
    status: {
        type: Boolean,
        default: false
    },
    language: String,
    // applications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Applications' }],
    createdAt: Date
})

module.exports = model('User',User)