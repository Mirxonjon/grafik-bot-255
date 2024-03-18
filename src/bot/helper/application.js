const { text } = require("express")
const Application = require("../../model/application")
// const Application = require("../../model/application")
const StatisticApplications = require("../../model/statisticAplication")
const User = require("../../model/user")
const { bot } = require("../bot")
const { timeKeyboard, day_offKeyboard, daysKeyboard, userKeyboardUz, userKeyboardRU, adminKeyboardUZ, adminKeyboardRu, SupervayzerKeyboard } = require("../menu/keyboard")
const { jobTime, Days, formatDate, DaysUz, DaysRu, Supervayzers  } = require("../../utils/time")
const { writeToSheet } = require("../../utils/google_cloud")

const getAlltime = async (msg) => {
    const chatId = msg.from.id

    let user = await User.findOne({chatId}).lean()

    await User.findByIdAndUpdate(user._id,{...user , action : 'addtime'},{new:true})


    bot.sendMessage(chatId , user.language == 'uz' ?  '<b>Ish grafikni</b> tanlang' : 'Выберите <b>график работы</b>' , {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard : timeKeyboard ,  
            // remove_keyboard : true,
            resize_keyboard: true
        }
    })
    
}

const addApplication = async (msg) => {
    const chatId = msg.from.id
    const text = msg.text
    
    let user = await User.findOne({chatId}).lean()
    
    
    if(jobTime.includes(text)) {
        await User.findByIdAndUpdate(user._id,{...user , action : 'add_day_off_first'},{new:true})
        const  application = await Application.findOne({user:user._id}).lean()
        const days_Keyboard = await daysKeyboard(user)

if(application) {
    await Application.findByIdAndUpdate(application._id,{...application , supervayzer: '' , time : text})


    bot.sendMessage(chatId ,  user.language == 'uz' ?  `<b>1-dam olish kunini </b> tanlang` :'Выберите <b>1-й выходной день</b>', {
        parse_mode:'HTML',
        reply_markup: {
            keyboard:days_Keyboard,
            resize_keyboard : true
            
        }
    })

} else {
    let newApplication = new Application({
        user: user._id,
        time: text
    })
    await newApplication.save()

    bot.sendMessage(chatId ,  user.language == 'uz' ?  `<b>1-dam olish kunini </b>tanlang` :'Выберите <b>1-й выходной день</b>', {
        parse_mode : 'HTML',
        reply_markup: {
            keyboard:   days_Keyboard ,
                resize_keyboard : true
            
        }
    })
}
}else if(text == 'Смена') {
    await User.findByIdAndUpdate(user._id,{...user , action : 'add_supervayzer'},{new:true})
    const  application = await Application.findOne({user:user._id}).lean()

if(application) {
await Application.findByIdAndUpdate(application._id,{...application , day_off :'', time : text})


bot.sendMessage(chatId ,  user.language == 'uz' ?  `<b>Supervayzer</b> tanlang` :'Выберите <b>Супервайзер</b>', {
    parse_mode:'HTML',
    reply_markup: {
        keyboard:  [ ...SupervayzerKeyboard ,
            [
                {
                    text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
                }
            ]
        ],
        resize_keyboard : true
    }
})

} else {
let newApplication = new Application({
    user: user._id,
    time: text
})
await newApplication.save()

bot.sendMessage(chatId ,  user.language == 'uz' ? `<b>Supervayzer</b> tanlang` :'Выберите <b>Супервайзер</b>', {
    parse_mode : 'HTML',
    reply_markup: {
        keyboard: [ ...SupervayzerKeyboard ,
            [
                {
                    text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
                }
            ]
        ],
        resize_keyboard : true

    }
})
}
} else {
    bot.sendMessage(chatId , user.language == 'uz' ? '<b>Ish grafikni</b>tanlang' : 'Выберите <b>график работы</b>' , {
        parse_mode :'HTML',
        reply_markup: {
            one_time_keyboard : timeKeyboard,
            // remove_keyboard : true,
            resize_keyboard: true
        }
    })
}
}

const addSupervazer = async(msg) => {
    const chatId = msg.from.id
    const  text = msg.text

    let  user  = await User.findOne({chatId}).lean()

    if(Supervayzers.includes(text)) {
        await User.findByIdAndUpdate(user._id,{...user , action : 'application_comment'},{new:true})

        const  application = await Application.findOne({user:user._id}).lean()

        await Application.findByIdAndUpdate(application._id,{...application , supervayzer : text })

        bot.sendMessage(chatId ,  user.language == 'uz' ?  `<b>So‘rov sababini</b> yozing` :'Напишите <b>причину запроса</b>', {
            parse_mode :'HTML',
            reply_markup: {
                remove_keyboard :true,
                keyboard :   [
                   [ {
                        text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
                    }]
                ],
                resize_keyboard :true
            }
        })
    } else if(text == 'Ortga qaytish' || text == 'Назад') {
        await User.findByIdAndUpdate(user._id,{...user , action : 'addtime'},{new:true})


        bot.sendMessage(chatId , user.language == 'uz' ?  '<b>Ish grafikni</b> tanlang' : 'Выберите <b>график работы</b>' , {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard : timeKeyboard ,  
                // remove_keyboard : true,
                resize_keyboard: true
            }
        })
    } else {
        bot.sendMessage(chatId ,  user.language == 'uz' ?  `<b>Supervayzer</b> tanlang` :'Выберите <b>Супервайзер</b>', {
            parse_mode:'HTML',
            reply_markup: {
                keyboard:  [ ...SupervayzerKeyboard ,
                    [
                        {
                            text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
                        }
                    ]
                ],
        resize_keyboard : true

            }
        })
    }

}



const addDayOffFirst = async(msg) => {
    const chatId = msg.from.id
    const  text = msg.text

    let  user  = await User.findOne({chatId}).lean()

    // await User.findByIdAndUpdate(user._id,{...user , action : 'add_day_off_second'},{new:true})
    const days_Keyboard = await daysKeyboard(user)
    
    if(DaysUz.includes(text) || DaysRu.includes(text)) {

        let findlanguageDays = user.language == 'uz' ? DaysUz : DaysRu

        
        let filteredArr =  findlanguageDays.filter(e => e != text)
        let sortDaysArr =[]
        filteredArr.map((e, i) => (i+1)%2 != 0 ? sortDaysArr.push([filteredArr[i],filteredArr[i+1]] ) : null )


        await User.findByIdAndUpdate(user._id,{...user , action : 'add_day_off_second'},{new:true})

        const  application = await Application.findOne({user:user._id}).lean()


        await Application.findByIdAndUpdate(application._id,{...application , day_off : text})



    bot.sendMessage(chatId ,  user.language == 'uz' ?  `<b>2-dam olish kunini </b>tanlang` :'Выберите <b>2-й выходной день</b>', {
        parse_mode:'HTML',
        reply_markup: {
            remove_keyboard: true ,
            keyboard : [
                ...sortDaysArr ,
                [
                    {
                        text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
                    }
                ]
            ],
            resize_keyboard: true 
        }
    })


} else if(text == 'Ortga qaytish' || text == 'Назад') {
    
    await User.findByIdAndUpdate(user._id,{...user , action : 'addtime'},{new:true})


    bot.sendMessage(chatId , user.language == 'uz' ?  '<b>Ish grafikni</b> tanlang' : 'Выберите <b>график работы</b>' , {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard : timeKeyboard ,  
            // remove_keyboard : true,
            resize_keyboard: true
        }
    })
} else {
    bot.sendMessage(chatId , user.language == 'uz' ?  `<b>1-dam olish kunini </b>tanlang` :'Выберите <b>1-й выходной день</b>' , {
        parse_mode: 'HTML',
        reply_markup: {
            keyboard :  [ ...days_Keyboard ,
                {
                    text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
                }
            ],
            resize_keyboard: true
        }
    })
}

}

const addDayOffSecond = async(msg) => {
    const chatId = msg.from.id
    const  text = msg.text

    let  user  = await User.findOne({chatId}).lean()

    // await User.findByIdAndUpdate(user._id,{...user , action : 'add_day_off_second'},{new:true})
    
    if(DaysUz.includes(text) || DaysRu.includes(text)) {
        await User.findByIdAndUpdate(user._id,{...user , action : 'application_comment'},{new:true})

        const  application = await Application.findOne({user:user._id}).lean()


        await Application.findByIdAndUpdate(application._id,{...application , day_off : `${application.day_off},${text}`})



    bot.sendMessage(chatId ,  user.language == 'uz' ?  `<b>So‘rov sababini</b> yozing` :'Напишите <b>причину запроса</b>', {
        parse_mode :'HTML',
        reply_markup: {
            keyboard : [
                [
                    {
                        text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
                    }
                ]
            ],
            resize_keyboard : true ,
            remove_keyboard: true ,
        }
    })


} else if(text == 'Ortga qaytish' || text == 'Назад') {
    
    await User.findByIdAndUpdate(user._id,{...user , action : 'add_day_off_first'},{new:true})
    const  application = await Application.findOne({user:user._id}).lean()
    const days_Keyboard = await daysKeyboard(user)


await Application.findByIdAndUpdate(application._id,{...application , day_off : ''})


bot.sendMessage(chatId ,  user.language == 'uz' ?  `<b>1-dam olish kunini </b> tanlang` :'Выберите <b>1-й выходной день</b>', {
    parse_mode:'HTML',
    reply_markup: {
        keyboard:days_Keyboard
    }
})
} else {
    const days_Keyboard = await daysKeyboard(user)

    bot.sendMessage(chatId , user.language == 'uz' ?  `<b>2-dam olish kunini </b> tanlang` :'Выберите <b>2-й выходной день</b>' , {
        parse_mode:'HTML',
        reply_markup: {
            keyboard :  [ ...days_Keyboard ,
                {
                    text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
                }
            ],
            // remove_keyboard : true,
            resize_keyboard: true
        }
    })
}
}

const  addComment = async (msg) => {
    const chatId = msg.from.id
    const  text = msg.text
    let  user  = await User.findOne({chatId}).populate().lean()

    if(text == 'Ortga qaytish' || text == 'Назад'){

        const  application = await Application.findOne({user:user._id}).lean()
        if(application.time == 'Смена') {
            await User.findByIdAndUpdate(user._id,{...user , action : 'add_supervayzer'},{new:true})
            bot.sendMessage(chatId ,  user.language == 'uz' ?  `<b>Supervayzer</b> tanlang` :'Выберите <b>Супервайзер</b>', {
                parse_mode:'HTML',
                reply_markup: {
                    keyboard:  [ ...SupervayzerKeyboard ,
                        [
                            {
                                text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
                            }
                        ]
                    ],
                    resize_keyboard : true
                }
            })
        } else {

        await User.findByIdAndUpdate(user._id,{...user , action : 'add_day_off_second'},{new:true})
        const days_Keyboard = await daysKeyboard(user)



        await Application.findByIdAndUpdate(application._id,{...application , day_off : `${application.day_off.split(',')[0]}`})
    
    
            let findlanguageDays = user.language == 'uz' ? DaysUz : DaysRu
    
            
            let filteredArr =  findlanguageDays.filter(e => e != application.day_off.split(',')[0])
            let sortDaysArr =[]
            filteredArr.map((e, i) => (i+1)%2 != 0 ? sortDaysArr.push([filteredArr[i],filteredArr[i+1]] ) : null )
    
    
            // await User.findByIdAndUpdate(user._id,{...user , action : 'add_day_off_second'},{new:true})
    
            // const  application = await Application.findOne({user:user._id}).lean()
    
    
            // await Application.findByIdAndUpdate(application._id,{...application , day_off : text})
    
    
    
        bot.sendMessage(chatId ,  user.language == 'uz' ?  `<b>2-dam olish kunini </b>tanlang` :'Выберите <b>2-й выходной день</b>', {
            parse_mode:'HTML',
            reply_markup: {
                remove_keyboard: true ,
                keyboard : [
                    ...sortDaysArr ,
                    [
                        {
                            text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
                        }
                    ]
                ],
                resize_keyboard: true 
            }
        })
    }

    } else {


    const  application = await Application.findOne({user:user._id}).lean()
    await User.findByIdAndUpdate(user._id,{...user , action : 'sent'},{new:true})

    await Application.findByIdAndUpdate(application._id,{...application , application_latter: text})

    bot.sendMessage(chatId , user.language == 'uz' ?  `
<b>F.I.Sh:</b> ${user?.full_name} 
<b>Ulashilgan telefon raqam:</b> ${user?.sharePhone}
<b>Tasdiqlangan telefon raqam:</b> ${user?.phone}
<b>Ish vaqti:</b> : ${application?.time}
${application.time == 'Смена' ? `<b>Supervayzer </b> : ${application.supervayzer}` : `<b>Dam olish kunlari:</b> ${application?.day_off}`}
<b>Sababi:</b> ${text}
    
So‘rovni yuborish uchun <b>"Jo‘natish"</b> tugmasini bosing!
        
        ` : `
<b>Ф.И.О.:</b> ${user?.full_name} 
<b>Отправленный номер телефона:</b> ${user?.sharePhone}
<b>Подтверждённый номер:</b> ${user?.phone}
<b>Рабочее время:</b> : ${application?.time}
${application.time == 'Смена' ? `<b>Супервайзер </b> : ${application.supervayzer}` : `<b>Выходные дни:</b> ${application?.day_off}`}
<b>Причина:</b> ${text}
        
Нажмите кнопку <b> «Отправить» </b> чтобы отправить заявку!
            ` , {parse_mode: 'HTML',
        reply_markup: {
            keyboard : [
                [
                    {
                        text: user.language == 'uz' ? `Jo‘natish` : 'Отправить' 
                    },   
                    {
                        text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
                    }
                ]
            ],
            // remove_keyboard : true,
            resize_keyboard: true
        }
    })
}

    
}


const  sentApplication = async (msg) => {
    const chatId = msg.from.id
    const text = msg.text

    let  user  = await User.findOne({chatId}).populate().lean()
    if(text == `Jo‘natish` || text ==  'Отправить' ) {
        await User.findByIdAndUpdate(user._id,{...user , action : 'menu'},{new:true})
        const  application = await Application.findOne({user:user._id}).lean()
        await Application.findByIdAndUpdate(application._id,{...application , sent :true, createdAt :  new Date()})


        bot.sendMessage(chatId , user.language == 'uz' ?  `So‘rovingiz qabul qilindi!` : `Ваша заявка принята` , {
            reply_markup: {
                keyboard : user.language=='uz' ? userKeyboardUz : userKeyboardRU ,
                // remove_keyboard : true,
                resize_keyboard: true
            }
        })
        
    } else if(text == 'Ortga qaytish' || text == 'Назад') {
        const chatId = msg.from.id

        let user = await User.findOne({chatId}).lean()
    
        await User.findByIdAndUpdate(user._id,{...user , action : 'addtime'},{new:true})
    
    
        bot.sendMessage(chatId , user.language == 'uz' ?  '<b>Ish grafikni</b> tanlang' : 'Выберите <b>график работы</b>' , {
            parse_mode: 'HTML',
            reply_markup: {
                keyboard : timeKeyboard ,  
                // remove_keyboard : true,
                resize_keyboard: true
            }
        })
    }  else {
        bot.sendMessage(chatId , user.language == 'uz' ?  `Noto'g'ri xabar yubordingiz` : `Вы отправили неправильное сообщение` , {
            reply_markup: {
                keyboard : [
                    [
                        {
                            text: user.language == 'uz' ? `Jo‘natish` : 'Отправить' 
                        }
                    ]
                ] ,
                // remove_keyboard : true,
                resize_keyboard: true
            }
        })
    }

}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const showApplication =  async (msg) => {
    const chatId = msg.from.id
    const text = msg.text
    
    let  user  = await User.findOne({chatId}).populate().lean()

    const findAllApplications = await Application.find({sent: true}).populate(['user']).lean()

    if(findAllApplications.length) {


    findAllApplications.forEach( async e => {
        await delay(1000)
        bot.sendMessage(chatId , user.language == 'uz' ?  `
<b>F.I.Sh:</b> ${e?.user?.full_name} 
<b>Ulashilgan telefon raqam:</b> ${e.user?.sharePhone}
<b>Tasdiqlangan telefon raqam:</b> ${e.user?.phone}
<b>Ish vaqti:</b> : ${e?.time}
${e.time == 'Смена' ? `<b>Supervayzer </b> : ${e.supervayzer}` : `<b>Dam olish kunlari:</b> ${e?.day_off}`}
<b>Sababi:</b> ${e?.application_latter}
<b>Yuborilgan sana</b> ${  formatDate(e?.createdAt)  }
    
Operator arizasini tasdiqlasangiz "✅"
        
        ` : `
<b>Ф.И.О.:</b> ${e?.user?.full_name} 
<b>Отправленный номер телефона:</b> ${e.user?.sharePhone}
<b>Подтверждённый номер телефона:</b> ${e.user?.phone}
<b>Рабочее время:</b> : ${e?.time}
${e.time == 'Смена' ? `<b>Супервайзер </b> : ${e.supervayzer}` : `<b>Выходные дни:</b> ${e?.day_off}`}
<b>Причина:</b> ${e?.application_latter}
<b>Дата отправки</b> ${formatDate(e?.createdAt)}
        
Если вы одобрите заявку оператора "✅"
            ` , {parse_mode: 'HTML',
            reply_markup: {
                inline_keyboard : [
                    [
                        {
                            text: 'Comment' ,
                            callback_data : `applicationChat_${e?.user?._id}`
                        }
                    ],
                    [
                        {
                            text: '✅',
                            callback_data : `appliaction_true_${e._id}`
                             
                        },
                        {
                            text: '❌',
                            callback_data : `appliaction_false_${e._id}`
                             
                        }
                    ]
                ],
                resize_keyboard: true
            }
        })
    })
}else {
      
    bot.sendMessage(chatId, user.language == 'uz' ? `Sorovlar Hozircha yo'q, Menyuni tanlang, ${user.admin ? 'Admin': user.full_name}`: `Выберите меню, ${user.admin ? 'Admin': user.full_name}`,{
        reply_markup: {
            keyboard: user.admin == true ? user.language == 'uz' ? adminKeyboardUZ : adminKeyboardRu  : user.language=='uz' ? userKeyboardUz : userKeyboardRU ,
            resize_keyboard: true
        },
    })
    }



}


const ApplicationChat = async(query) => {

    const chatId = query.from.id
    const text = query.text
    const message_id = query.message.message_id
    let dataArr = query.data.split('_')
    let  getUser  = await User.findOne({_id : dataArr[1]}).populate().lean()
    let  senderUser = await User.findOne({chatId}).populate().lean()


    if(!senderUser.admin) {
        if(senderUser.messageCount) {
            bot.sendMessage(senderUser.chatId , senderUser.language == 'uz' ?  `Siz Adminga Habar yuborib Boldingiz` : `Вы отправили сообщение администратору` , {
                reply_markup: {
                    keyboard:  senderUser.language=='uz' ? userKeyboardUz : userKeyboardRU ,
                    resize_keyboard: true
                }
            })
        }  else{
            await User.findByIdAndUpdate(senderUser._id,{...senderUser , action : `sent_message_to-${getUser.chatId}`},{new:true})
            bot.sendMessage(chatId , senderUser.language == 'uz' ?  `${getUser.full_name} ga Xabar yuborish` : `Отправить сообщение на ${getUser.full_name}` , {
                reply_markup: {
                    keyboard : [
                        [
                            {
                                text: senderUser.language == 'uz' ? `Chatni yakunlash` : 'Закончит чат' 
                            }
                        ]
                    ] ,

                    resize_keyboard: true
                }
            })
        }
        
    } else {
        
        await User.findByIdAndUpdate(senderUser._id,{...senderUser , action : `sent_message_to-${getUser.chatId}`},{new:true})
        await User.findByIdAndUpdate(getUser._id,{...getUser, lastMessageAdmin : ``,messageCount:0,},{new:true})
        
        bot.sendMessage(chatId , senderUser.language == 'uz' ?  `${getUser.full_name} ga Xabar yuborish` : `Отправить сообщение на ${getUser.full_name}` , {
            reply_markup: {
                keyboard : [
                    [
                        {
                            text: senderUser.language == 'uz' ? `Chatni yakunlash` : 'Закончит чат' 
                        }
                    ]
                ] ,

                resize_keyboard: true
            }
        })
    }



}

const SentMessagetoUser = async(msg) => {
    const chatId = msg.from.id
    const text = msg.text

    let  senderUser  = await User.findOne({chatId}).populate().lean()
    if(text == 'Chatni yakunlash' || text == 'Закончит чат') {
    await User.findByIdAndUpdate(senderUser._id,{...senderUser , action : `menu`},{new:true})


    bot.sendMessage(chatId, senderUser.language == 'uz' ? `Menyuni tanlang, ${senderUser.admin ? 'Admin': senderUser.full_name}`: `Выберите меню, ${senderUser.admin ? 'Admin': senderUser.full_name}`,{
        reply_markup: {
            keyboard: senderUser.admin == true ? senderUser.language == 'uz' ? adminKeyboardUZ : adminKeyboardRu  : senderUser.language=='uz' ? userKeyboardUz : userKeyboardRU ,
            resize_keyboard: true
        },
    })


    } else if(!senderUser.admin) {

        if(senderUser.messageCount) {
            bot.sendMessage(senderUser.chatId , senderUser.language == 'uz' ?  `Siz Adminga Habar yuborib Boldingiz` : `Вы отправили сообщение администратору` , {
                reply_markup: {
                    keyboard:  senderUser.language=='uz' ? userKeyboardUz : userKeyboardRU ,
                    resize_keyboard: true
                }
            })
        }else {
            // let  sadmin  = await User.findOne({chatId}).populate().lean()
        const findApplication = await Application.findOne({user:senderUser._id}).populate(['user']).lean()
        let  getUser  = await User.findOne({chatId : senderUser.action.split("-")[1]}).populate().lean()
        await User.findByIdAndUpdate(senderUser._id,{...senderUser, messageCount : senderUser.messageCount+1  ,},{new:true})


        bot.sendMessage( getUser.chatId, getUser.language == 'uz' ?  `
<b>F.I.Sh:</b> ${senderUser?.full_name} 
<b>Ulashilgan telefon raqam:</b> ${senderUser?.sharePhone}
<b>Tasdiqlangan telefon raqam:</b> ${senderUser?.phone}
<b>Ish vaqti:</b> ${findApplication?.time}
${findApplication.time == 'Смена' ? `<b>Supervayzer </b> : ${findApplication.supervayzer}` : `<b>Dam olish kunlari:</b> ${findApplication?.day_off}`}
<b>Sababi:</b> ${findApplication?.application_latter}
<b>Yuborilgan sana</b> ${formatDate(findApplication?.createdAt)}
<b>Admin Habari</b> : ${senderUser.lastMessageAdmin}

<b>Habar :</b> ${text} 
            ` : `
<b>Ф.И.О.:</b> ${senderUser?.full_name} 
<b>Отправленный номер телефона:</b> ${senderUser?.sharePhone}
<b>Подтверждённый номер телефона:</b> ${senderUser?.phone}
<b>Рабочее время:</b> : ${findApplication?.time}
${findApplication.time == 'Смена' ? `<b>Супервайзер </b> : ${findApplication.supervayzer}` : `<b>Выходные дни:</b> ${findApplication?.day_off}`}
<b>Причина:</b> ${findApplication?.application_latter}
<b>Дата отправки</b> ${formatDate(findApplication?.createdAt)}
                        ` , {
                    parse_mode :'HTML',
                    reply_markup: {
                      remove_keyboard: true,
                      inline_keyboard : [
                        [
                            {
                                text: 'Comment' ,
                                callback_data : `applicationChat_${senderUser?._id}`
                            }
                        ],
                        [
                            {
                                text: '✅',
                                callback_data : `appliaction_true_${findApplication._id}`
                                 
                            },
                            {
                                text: '❌',
                                callback_data : `appliaction_false_${findApplication._id}`
                                 
                            }
                        ]
                    ],
                    },
                  });
    

        bot.sendMessage(chatId, senderUser.language == 'uz' ? `Menyuni tanlang, ${senderUser.admin ? 'Admin': senderUser.full_name}`: `Выберите меню, ${senderUser.admin ? 'Admin': senderUser.full_name}`,{
            reply_markup: {
                keyboard: senderUser.admin == true ? senderUser.language == 'uz' ? adminKeyboardUZ : adminKeyboardRu  : senderUser.language=='uz' ? userKeyboardUz : userKeyboardRU ,
                resize_keyboard: true
            },
        })
        }
    } else {
        let  getUser  = await User.findOne({chatId : senderUser.action.split("-")[1]}).populate().lean()

        await User.findByIdAndUpdate(getUser._id,{...getUser, lastMessageAdmin : `${getUser.lastMessageAdmin} ${text}` ,},{new:true})
    
        bot.sendMessage(getUser.chatId , getUser.language == 'uz' ?  `${senderUser.full_name} dan sizga habar :  ${text}` : `Сообщение от ${senderUser.full_name} : ${text}` , {
            reply_markup: {
                inline_keyboard : [[{text:'Adminga Habar yuborish' , callback_data : `applicationChat_${senderUser?._id}`}]],
                // remove_keyboard : true,
                resize_keyboard: true
            }
        })
    }
    
   
}


const answerApplication = async (query) => {
    const chatId = query.from.id
    const text = query.text
    const message_id = query.message.message_id
    let dataArr = query.data.split('_')
    
    const findApplications = await Application.findOne({_id: dataArr[2]}).populate(['user']).lean()
    let user = await User.findOne({_id: findApplications.user?._id})
    let findAdmin = await User.findOne({chatId}).lean()
    await Application.findByIdAndUpdate(findApplications._id,{...findApplications , sent :false, })
    
    await User.findByIdAndUpdate(findAdmin._id,{action : 'menu'},{new:true})
    
    if(dataArr[1] == 'true') {

        bot.editMessageText( findAdmin.language == 'uz' ?  `
<b>F.I.Sh:</b> ${user?.full_name} 
<b>Ulashilgan telefon raqam:</b> ${user?.sharePhone}
<b>Tasdiqlangan telefon raqam:</b> ${user?.phone}
<b>Ish vaqti:</b> ${findApplications?.time}
${findApplications.time == 'Смена' ? `<b>Supervayzer </b> : ${findApplications.supervayzer}` : `<b>Dam olish kunlari:</b> ${findApplications?.day_off}`}
<b>Sababi:</b> ${findApplications?.application_latter}
<b>Yuborilgan sana</b> ${formatDate(findApplications?.createdAt)}   
            ` : `
<b>Ф.И.О.:</b> ${user?.full_name} 
<b>Отправленный номер телефона:</b> ${user?.sharePhone}
<b>Подтверждённый номер телефона:</b> ${user?.phone}
<b>Рабочее время:</b>: ${findApplications?.time}
${findApplications.time == 'Смена' ? `<b>Супервайзер </b> : ${findApplications.supervayzer}` : `<b>Выходные дни:</b> ${findApplications?.day_off}`}
<b>Причина:</b> ${findApplications?.application_latter}
<b>Дата отправки</b> ${formatDate(findApplications?.createdAt)}
                ` , {
            chat_id: chatId,
            message_id,
            parse_mode :'HTML',
            reply_markup: {
              remove_keyboard: true,
              inline_keyboard : [[{text:'ko‘rib chiqildi ✅' , callback_data : 'data_answer'}]]
            },
          });

          bot.sendMessage(user.chatId , user.language == 'uz' ?  `So‘rovingiz qanoatlantirildi!` : `Ваш запрос удовлетворен!` , {
            reply_markup: {
                keyboard : user.language=='uz' ? userKeyboardUz : userKeyboardRU ,
                resize_keyboard: true
            }
        })

       let addStatistic = new StatisticApplications({

        full_name : user.full_name ,
        number : user.phone ,
        sharePhone: user.sharePhone,
        requestCount : user.requestCount,
        application_latter : findApplications.application_latter,
        time : findApplications.time,
        day_off : findApplications.day_off ,
        sentdata : formatDate(findApplications.createdAt) ,
        admin_confirmation : 'Ha',
        createdAt: new Date(),
       })

      await writeToSheet([[user.chatId, user.IdNumber, user.full_name, user.phone , user.sharePhone ,findApplications.application_latter , findApplications.time , findApplications.time == 'Смена' ? findApplications.supervayzer : findApplications.day_off, formatDate(findApplications.createdAt), 'HA' ,  formatDate(new Date())]])

       await addStatistic.save()
    } else {
        bot.editMessageText(findAdmin.language == 'uz' ?  `
<b>F.I.Sh:</b> ${user?.full_name} 
<b>Ulashilgan telefon raqam:</b> ${user?.sharePhone}
<b>Tasdiqlangan telefon raqam:</b> ${user?.phone}
<b>Ish vaqti:</b> ${findApplications?.time}
${findApplications.time == 'Смена' ? `<b>Supervayzer </b> : ${findApplications.supervayzer}` : `<b>Dam olish kunlari:</b> ${findApplications?.day_off}`}
<b>Sababi:</b> ${findApplications?.application_latter}
<b>Yuborilgan sana</b> ${formatDate(findApplications?.createdAt)}
            ` : `
<b>Ф.И.О.:</b> ${user?.full_name} 
<b>Отправленный номер телефона:</b> ${user?.sharePhone}
<b>Подтверждённый номер телефона:</b> ${user?.phone}
<b>Рабочее время:</b> : ${findApplications?.time}
${findApplications.time == 'Смена' ? `<b>Супервайзер </b> : ${findApplications.supervayzer}` : `<b>Выходные дни:</b> ${findApplications?.day_off}`}
<b>Причина:</b> ${findApplications?.application_latter}
<b>Дата отправки</b> ${formatDate(findApplications?.createdAt)}
                `, {
            chat_id: chatId,
            message_id,
            parse_mode :'HTML',
            reply_markup: {
              remove_keyboard: true,
              inline_keyboard : [[{text:`ko‘rib chiqildi ❌ ` , callback_data : 'data_answer'}]]
            },
          });
          bot.sendMessage(user.chatId , user.language == 'uz' ?  `So‘rovingiz rad etildi!` : `Ваш запрос отклонен!` , {
            reply_markup: {
                keyboard : user.language=='uz' ? userKeyboardUz : userKeyboardRU ,
                resize_keyboard: true
            }
        })

        let addStatistic = new StatisticApplications({
            full_name : user.full_name ,
            number : user.phone ,
            sharePhone: user.sharePhone,
            requestCount : user.requestCount,
            application_latter : findApplications.application_latter,
            time : findApplications.time,
            day_off : findApplications.day_off ,
            sentdata : formatDate(findApplications.createdAt),
            admin_confirmation : `Yo'q`,
            createdAt: new Date(),
           })

           await writeToSheet([[user.chatId ,user.IdNumber, user.full_name, user.phone, user.sharePhone ,findApplications.application_latter , findApplications.time , findApplications.day_off, formatDate(findApplications.createdAt), `Yo'q` ,  formatDate(new Date())]])
    
           await addStatistic.save()
    }

}






module.exports = {
    getAlltime,
    addApplication,
    addApplication,
    addDayOffFirst,
    addDayOffSecond,
    addComment,
    sentApplication,
    showApplication,
    ApplicationChat, 
    SentMessagetoUser,           
    answerApplication,
    addSupervazer
}