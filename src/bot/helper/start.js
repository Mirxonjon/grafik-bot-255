const { text } = require("express")
const allOperatorsDate = require("../../model/allOperatorsDate")
const User = require("../../model/user")
const { readSheets } = require("../../utils/google_cloud")
const { bot } = require("../bot")
const { adminKeyboardUZ, adminKeyboardRu, userKeyboardUz, userKeyboardRU } = require("../menu/keyboard")

const  start = async( msg ) => {
    const chatId = msg.from.id

    let  checkUser =  await User.findOne({chatId}).lean()
    console.log('okk');
    console.log(checkUser, checkUser?.full_name && checkUser?.language && checkUser.status);


    if(checkUser?.full_name && checkUser?.language && checkUser?.sharePhone ) {
        console.log('okk');

        await User.findByIdAndUpdate(checkUser._id,{...checkUser ,  action:  'menu'  },{new:true})

        bot.sendMessage(chatId, checkUser.language == 'uz' ? `Menyuni tanlang, ${checkUser.admin ? 'Admin': checkUser.full_name}`: `Выберите меню, ${checkUser.admin ? 'Admin': checkUser.full_name}`,{
            reply_markup: {
                keyboard: checkUser.admin ? (checkUser.language == 'uz' ? adminKeyboardUZ : adminKeyboardRu)  : (checkUser.language=='uz' ? userKeyboardUz : userKeyboardRU) ,
                resize_keyboard: true
            },
        })
    }else if(checkUser && checkUser.status == false){
        if(checkUser.action == 'choose_language') {
            chooseLanguage(msg)
        }
        if(checkUser.action == 'add_idRMO') {
           idRMO(msg)
        }
        if(checkUser.action == 'add_name') {
            // addName(msg)
           idRMO(msg)
        }
        if(checkUser.action == 'request_contact') {
            requestContact(msg)
        }
        if(checkUser.action == 'retry_request_contact') {
            retryrequestContact(msg)
        }
    }else if (!checkUser) {
        let newUser = new User({
            chatId,
            admin: false,
            createdAt: new Date(),
            action: 'choose_language'
        })
        await newUser.save()
        bot.sendMessage(
            chatId,
            `Здравствуйте ${msg.from.first_name} ,  добро пожаловать в наш бот. Выберите язык 🇷🇺/🇺🇿`,
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


}



const  chooseLanguage = async (msg) => {
    const chatId = msg.from.id
    const text =  msg.text
    let user = await User.findOne({chatId}).lean()
    if(`🇺🇿 O‘zbekcha` == text || `🇷🇺  Русский` == text ) {
        user.language = text  == `🇺🇿 O‘zbekcha` ? 'uz' : 'ru' 
        user.action = 'add_idRMO'


        await User.findByIdAndUpdate(user._id,user,{new:true})
            bot.sendMessage(
                chatId,
                user.language == 'uz' ? `👤 Operator ID raqamingizni kiriting (Misol uchun: 123)` : `👤 Введите операторский ID номер (Например: 123)`,
                {
                    reply_markup : {
                        remove_keyboard : true
                    }
                })
    } else {
        bot.sendMessage(
            chatId,
            `Выберите язык 🇷🇺/🇺🇿`,
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
    }

const idRMO = async (msg) => {
    const chatId = msg.from.id
    const text = msg.text
    let user = await User.findOne({chatId}).lean()
    console.log(text,!isNaN(+text));

    if(!isNaN(+text)) {

    let findOperator = await allOperatorsDate.findOne({idNumber : text }).lean()

    if(findOperator) {
        user.action = 'add_name'


        await User.findByIdAndUpdate(user._id,user,{new:true})
         bot.sendMessage(
            chatId,
            user?.language == 'uz' ? `👤 <b>${findOperator?.full_name}</b> ismingiz to'grimi?` : `👤 <b>${findOperator?.full_name}</b> ваше имя правильно?`,
            {
                parse_mode : 'HTML',
                reply_markup : {
                    inline_keyboard: [  user?.language == 'uz' ?
                        [ 
                            {
                                text: `Ha` ,
                                callback_data : `add-name_yes_${findOperator?.idNumber}`
                            },
                            {
                                text: `Yo'q` ,
                                callback_data : `add-name_no`

                            },
                        ] :  [ 
                            {
                                text: `Да` ,
                                callback_data : `add-name_yes_${findOperator?.idNumber}`

                            },
                            {
                                text: `Нет` ,
                                callback_data : `add-name_no`

                            },
                        ]
                    ],
                    // resize_keyboard: true
                }
            })
       } else {
        user.action = 'add_idRMO'
        await User.findByIdAndUpdate(user._id,user,{new:true})
        bot.sendMessage(
            chatId,
            user.language == 'uz' ? `👤<b>${text}</b> Bunday raqamli operator topilmadi idingizni kiririting (masalan: 123)` : `👤 <b>${text}</b> Такой числовой оператор не найден. Введите свой Id
             (например: 123).`,
            {
                parse_mode :'HTML',
                reply_markup : {
                    remove_keyboard : true
                }
            })
       }
      
    }else {
        bot.sendMessage(
            chatId,
            user.language == 'uz' ? `👤 Operator ID raqamingizni kiriting (Misol uchun: 123)` : `👤 Введите операторский ID номер (Например: 123)`,
            {
                reply_markup : {
                    remove_keyboard : true
                }
            })
    }
}

const  addName = async (query) => {
    const chatId = query.from.id
    const data = query?.data?.split('_')
    
    console.log(data);

        let user = await User.findOne({chatId}).lean()
        
        
        if( 'yes' == data[1]) {
            
            let findOperator = await allOperatorsDate.findOne({idNumber : data[2] }).lean()
            user.full_name = findOperator.full_name
            user.IdNumber = data[2]
            user.phone = findOperator.number1
            user.phone2 = findOperator.number2


            user.action = 'request_contact'
            await User.findByIdAndUpdate(user._id,user,{new:true})
            bot.sendMessage(
                chatId,
                user.language == 'uz' ? `📱Telefon raqamingizni jo'nating` :   `📱Отправьте свой телефонный номер`,
                {
                    reply_markup: {
                        keyboard: [
                            [
                                {
                                    text: 'Telefon raqamni yuborish',
                                    request_contact: true,
                            one_time_keyboard: true

                                },
                            ],
                        ],
                        resize_keyboard: true
                    }
                })
        } else {
            bot.sendMessage(
                chatId,
                user.language == 'uz' ? `👤 Operator ID raqamingizni kiriting (Misol uchun: 123)` : `👤 Введите операторский ID номер (Например: 123)`,
                {
                    reply_markup : {
                        remove_keyboard : true
                    }
                })
           }
        }
    
    

const requestContact = async (msg) => {
    const chatId = msg.from.id
    let phonetext =  msg.text
    let user = await User.findOne({chatId}).lean()
    if(msg?.contact?.phone_number){
         phonetext = `+${+msg?.contact?.phone_number}`
         if (phonetext?.includes('+99') && !isNaN(+phonetext.split('+99')[1])  && phonetext.length >= 13 ){
         // if (phonetext){
            if(phonetext == user.phone || phonetext == user.phone2){
                user.sharePhone = phonetext
                user.admin = phonetext.includes('998981888857') ? phonetext.includes('998981888857') : phonetext.includes('998933843484')
                user.action = 'menu'
                user.status = true
                await User.findByIdAndUpdate(user._id,user,{new:true})
        
                bot.sendMessage(chatId, user.language == 'uz' ? `Menyuni tanlang, ${user.admin ? 'Admin': user.full_name}`: `Выберите меню, ${user.admin ? 'Admin': user.full_name}`,{
                    reply_markup: {
                        keyboard: user.admin ? user.language == 'uz' ? adminKeyboardUZ : adminKeyboardRu  : user.language=='uz' ? userKeyboardUz : userKeyboardRU ,
                        resize_keyboard: true
                    },
                })
            } else {
                user.action = 'retry_request_contact'
                user.sharePhone = phonetext
                await User.findByIdAndUpdate(user._id,user,{new:true})

                bot.sendMessage(
                    chatId,
                    user.language == 'uz' ?`📱Shaxsingizni tasdiqlash uchun, telefon raqamni to'liq kiriting (masalan: +998******${user.phone.slice(-3)}  ${user.phone2.includes('+99') ? `, +998******${user.phone2?.slice(-3)}` : ' ' })` :   `📱Для подтверждения личности введите полный номер телефона (например: +998******${user.phone.slice(-3)}  ${user.phone2 ? `, +998******${user.phone2?.slice(-3)}` : ')' })`,
                    {
                        reply_markup: {
                            remove_keyboard :  true
                            // one_time_keyboard: true
                        }
                    })
            }
 
         } else {
            bot.sendMessage(
                chatId,
                user.language == 'uz' ? `📱Telefon raqamingizni jo'nating` : `📱Отправьте свой телефонный номер` ,
                {
                    reply_markup: {
                        keyboard: [
                            [
                                {
                                    text: user.language == 'uz' ?  'Telefon raqamni yuborish' : `Отправить мой телефонный номер`,
                                    request_contact: true,
                                    one_time_keyboard: true
                                },
                            ],
                        ],
                        resize_keyboard: true
                    }
                })
         }
    }else {
        bot.sendMessage(
            chatId,
            user.language == 'uz' ? `📱Telefon raqamingizni jo'nating` :   `📱Отправьте свой телефонный номер` ,
            {
                reply_markup: {
                    keyboard: [
                        [
                            {
                                text: 'Telefon raqamni yuborish',
                                request_contact: true,
                        one_time_keyboard: true

                            },
                        ],
                    ],
                    resize_keyboard: true
                }
            })
    }

  

}

const retryrequestContact = async (msg) => {
    const chatId = msg.from.id
    let phonetext =  msg.text
    
    let user = await User.findOne({chatId}).lean() 

    if (phonetext?.includes('+99') && !isNaN(+phonetext?.split('+99')[1])  && phonetext?.length >= 13 ){
    if ( user.phone == phonetext || user.phone2 == phonetext){
        user.phone = phonetext
        user.admin = phonetext.includes('998981888857') ? phonetext.includes('998981888857') : phonetext.includes('998933843484')
        user.action = 'menu'
        user.status = true
        await User.findByIdAndUpdate(user._id,user,{new:true})

        bot.sendMessage(chatId, user.language == 'uz' ? `Menyuni tanlang, ${user.admin ? 'Admin': user.full_name}`: `Выберите меню, ${user.admin ? 'Admin': user.full_name}`,{
            reply_markup: {
                keyboard: user.admin ? user.language == 'uz' ? adminKeyboardUZ : adminKeyboardRu  : user.language=='uz' ? userKeyboardUz : userKeyboardRU ,
                resize_keyboard: true
            },
        })
    } else {
        bot.sendMessage(
            chatId,
            user.language == 'uz' ? `📱Iltimos to‘g‘ri kiriting! (masalan: +998******${user.phone.slice(-3)}  ${user.phone2.includes('+99') ? `, +998******${user.phone2?.slice(-3)}` : '' })` :   `📱Пожалуйста, введите правильно (например: +998******${user.phone.slice(-3)}  ${user.phone2 ? `, +998******${user.phone2?.slice(-3)}` : ')' })`,
            {
                reply_markup: {
                remove_keyboard: true
                }
            })
    }


    } else {
        bot.sendMessage(
            chatId,
            user.language == 'uz' ? `📱Iltimos to‘g‘ri kiriting! (masalan: +998******${user.phone.slice(-3)}  ${user.phone2.includes('+99') ? `, +998******${user.phone2?.slice(-3)}` : '' })` :   `📱Пожалуйста, введите правильно (например: +998******${user.phone.slice(-3)}  ${user.phone2 ? `, +998******${user.phone2?.slice(-3)}` : ')' })`,
            {
                reply_markup: {
                remove_keyboard: true
                }
            })

    }

}



module.exports = {
    start,
    chooseLanguage,
    idRMO,
    addName,
    requestContact,
    retryrequestContact
}