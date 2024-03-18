const User = require("../../model/user")
const { bot } = require("../bot")
const { adminKeyboardUZ, adminKeyboardRu, userKeyboardUz, userKeyboardRU } = require("../menu/keyboard")

const changeLanguage = async (msg) => {
    const chatId = msg.from.id
    let user = await User.findOne({chatId}).lean()

    user.action = 'choose_new_language'

    await User.findByIdAndUpdate(user._id,user,{new:true})

    bot.sendMessage(
        chatId,
         user.language == 'uz' ? `🇷🇺/🇺🇿 Tilni o‘zgartirish` :  `Выберите язык 🇷🇺/🇺🇿`,
        {
            reply_markup: {
                keyboard: [
                    [
                        {
                            text: `🇺🇿 O‘zbekcha` ,
                        },
                        {
                            text: `🇷🇺  Русский` ,
                        },
                    ],
                ],
                resize_keyboard: true
            }
        })
}

const chooseNewLanguage = async(msg) => {
    const chatId = msg.from.id
    const text = msg.text

    let user = await User.findOne({chatId}).lean()
    
    if(`🇺🇿 O‘zbekcha` == text || `🇷🇺  Русский` == text ) {
        user.language = text  == `🇺🇿 O‘zbekcha` ? 'uz' : 'ru' 
        user.action = 'menu'
        
        await User.findByIdAndUpdate(user._id,user,{new:true})
        bot.sendMessage(chatId, user.language == 'uz' ? `Menyuni tanlang, ${user.admin ? 'Admin': user.full_name}`: `Выберите меню, ${user.admin ? 'Admin': user.full_name}`,{
            reply_markup: {
                keyboard: user.admin ? user.language == 'uz' ? adminKeyboardUZ :adminKeyboardRu  : user.language=='uz' ? userKeyboardUz : userKeyboardRU ,
                resize_keyboard: true
            },
        })
    } else {
        bot.sendMessage(
            chatId,
            user.language == 'uz' ? `🇷🇺/🇺🇿 Tilni o‘zgartirish` :  `Выберите язык 🇷🇺/🇺🇿`,
            {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: `🇺🇿 O'zbekcha` ,
                            },
                            {
                                text: `🇷🇺  Русский` ,
                            },
                        ],
                    ],
                    resize_keyboard: true
                }
            })
    }
}

module.exports = {
    changeLanguage,
    chooseNewLanguage
}