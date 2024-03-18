const StatisticAplication = require("../../model/statisticAplication")
const User = require("../../model/user")
const { formatDate, dateDayObj, InfoUserArr, sentAllOperatorGrafic } = require("../../utils/time")
const { arrayToExcel } = require("../../utils/utils")
const { bot } = require("../bot")
const { statisticKeyboardRu, statisticKeyboardUz, CalendarKeyboardUz, adminKeyboardRu, adminKeyboardUZ, CalendarKeyboardRu } = require("../menu/keyboard")

const  ShowDepeartment = async (msg) => {
    const chatId = msg.from.id

    const user = await User.findOne({chatId}).lean()

    await User.findByIdAndUpdate(user._id , {...user , action : 'show-department'})
    bot.sendMessage(chatId ,  user.language == 'uz' ? `Kerakli bo'limni tanldang` : `Выберите необходимый раздел`, {
        reply_markup : {
            keyboard : user.language == 'uz' ? statisticKeyboardUz  : statisticKeyboardRu
        }
    })

}

const positiveAnswersMoth = async (msg) => {
    const chatId = msg.from.id 
    const user = await User.findOne({chatId}).lean()

    let findkeyboardLang = user.language == 'uz' ? CalendarKeyboardUz  : CalendarKeyboardRu

    findkeyboardLang.map(e => e.map(j => j.callback_data = `positive_${j.info}_${j.text}`) )

    // const findPositiveApplications = 
    bot.sendMessage(chatId ,  user.language == 'uz' ? `Ijobiy javob berilgan ma'lumotlar, kerakli oyni tanlang:` : `Данные, на которых был дан положительный ответ, выберите нужный месяц:`  , {
        reply_markup : {
            inline_keyboard :findkeyboardLang
        }
    })
}

const rejectedAnswersMoth = async (msg) => {
    const chatId = msg.from.id 
    const user = await User.findOne({chatId}).lean()

    let findkeyboardLang = user.language == 'uz' ? CalendarKeyboardUz  : CalendarKeyboardRu

    findkeyboardLang.map(e => e.map(j => j.callback_data = `rejected_${j.info}_${j.text}`) )

    bot.sendMessage(chatId , user.language == 'uz' ? `Rad javobi berilgan ma'lumotlar, kerakli oyni tanlang:` : `Данные, на которых был дан отказ, выберите нужный месяц:` , {
        reply_markup : {
            inline_keyboard :findkeyboardLang
        }
    })
}

const allAnswersMoth = async (msg) => {
    const chatId = msg.from.id 
    const user = await User.findOne({chatId}).lean()

    let findkeyboardLang = user.language == 'uz' ? CalendarKeyboardUz  : CalendarKeyboardRu

    findkeyboardLang.map(e => e.map(j => j.callback_data = `answerAll_${j.info}_${j.text}`) )

    bot.sendMessage(chatId , user.language == 'uz' ? `Barcha javobi berilgan ma'lumotlar,  Kerakli Oy ni tanlang:` : `Данные, на которых были даны все ответы, выберите нужный месяц:` , {
        reply_markup : {
            inline_keyboard :findkeyboardLang
        }
    })
}

const positiveAnswers = async (query) => {
    const chatId = query.from.id 
    const user = await User.findOne({chatId}).lean()
    const dataCallback = query.data.split('_')
    const monthDate = +dataCallback[1]
    const monthName = dataCallback[2]



    const startDate = new Date(Date.UTC(2024, monthDate - 1 , 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(2024, monthDate - 1 , dateDayObj[monthDate], 23, 59, 0));

    let  findAllStatistikAplication = await StatisticAplication.find({
        admin_confirmation: 'Ha',
        createdAt: {
            $gte:  startDate,
            $lte: endDate,
        }
    }).lean()

    if(!findAllStatistikAplication.length) {
        bot.sendMessage(chatId , user.language == 'uz' ?  `Ma'lumot yo‘q` : 'Нет информации' )
    }else {
        findAllStatistikAplication.map(e => InfoUserArr.push([e.full_name , e.number , e.time,e.day_off, e.application_latter,e.requestCount  ,e.sentdata ,e.admin_confirmation , formatDate(e.createdAt) ]))
        const xlsx = await arrayToExcel(InfoUserArr ,`${monthName}.xlsx` , `${monthName}.xlsx`)

        await bot.sendDocument(chatId , xlsx,{caption :  user.language =='uz' ? 'Ijobiy javob berilganlar' : 'Положительные ответы'  },  {
            filename : `${monthName}.xlsx` ,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',})
    }

}

const rejectedAnswers = async (query) => {

    const chatId = query.from.id 
    const user = await User.findOne({chatId}).lean()
    const dataCallback = query.data.split('_')
    const monthDate = +dataCallback[1]
    const monthName = dataCallback[2]



    const startDate = new Date(Date.UTC(2024, monthDate - 1 , 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(2024, monthDate - 1 , dateDayObj[monthDate], 23, 59, 0));

    let  findAllStatistikAplication = await StatisticAplication.find({
        admin_confirmation: `Yo'q`,
        createdAt: {
            $gte:  startDate,
            $lte: endDate,
        }
    }).lean()

    if(!findAllStatistikAplication.length) {
        bot.sendMessage(chatId , user.language == 'uz' ?  `Ma'lumot yo‘q` : 'Нет информации' )
    }else {
        findAllStatistikAplication.map(e => InfoUserArr.push([e.full_name , e.number , e.time,e.day_off, e.application_latter,e.requestCount  ,e.sentdata ,e.admin_confirmation , formatDate(e.createdAt) ]))
        const xlsx = await arrayToExcel(InfoUserArr ,`${monthName}.xlsx` , `${monthName}.xlsx`)

        await bot.sendDocument(chatId , xlsx,{caption : user.language =='uz' ? 'Rad javobi berilganlar': 'Отклоненный' },  {
            filename : `${monthName}.xlsx` ,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',})
    }


    
}

const allAnswers = async(query) => {
    const chatId = query.from.id 
    const user = await User.findOne({chatId}).lean()
    const dataCallback = query.data.split('_')
    const monthDate = +dataCallback[1]
    const monthName = dataCallback[2]



    const startDate = new Date(Date.UTC(2024, monthDate - 1 , 1, 0, 0, 0));
    const endDate = new Date(Date.UTC(2024, monthDate - 1 , dateDayObj[monthDate], 23, 59, 0));
    let  findAllStatistikAplication = await StatisticAplication.find({
        createdAt: {
            $gte:  startDate,
            $lte: endDate,
        }
    }).lean()

    if(!findAllStatistikAplication.length) {
        bot.sendMessage(chatId , user.language == 'uz' ?  `Ma'lumot yo‘q` : 'Нет информации' )

    }else {
        findAllStatistikAplication.map(e => InfoUserArr.push([e.full_name , e.number , e.time,e.day_off, e.application_latter,e.requestCount  ,e.sentdata ,e.admin_confirmation , formatDate(e.createdAt) ]))
        const xlsx = await arrayToExcel(InfoUserArr ,`${monthName}.xlsx` , `${monthName}.xlsx`)

        await bot.sendDocument(chatId , xlsx,{caption :  user.language =='uz' ? 'Barcha javob berilganlar' : 'На все есть ответы'  },  {
            filename : `${monthName}.xlsx` ,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',})
    }

}


const allUsers = async(msg) => {
    const chatId = msg.from.id 
    const user = await User.findOne({chatId}).lean()

    let Users = await User.find({
        admin: false
    }).lean()


    let InfoUser = [
        [
            'F.I.Sh',
            'Telefon raqam',
            `Ro'yhatdan o'tgan vaqti`
        ]
      ]



        Users.map(e => InfoUser.push([e.full_name , e.number , formatDate(e.createdAt) ]))
        const xlsx = await arrayToExcel(InfoUser ,`Users.xlsx` , `Users.xlsx`)
        await bot.sendDocument(chatId , xlsx,{caption :  user.language =='uz' ? 'Foydalanuvchilar' : 'Пользователи'  },  {
            filename : `Users.xlsx` ,
            contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',})

}

const  sentMessageToAllUsersMenu = async(msg) => {
    const chatId = msg.from.id 
    const user = await User.findOne({chatId}).lean()

    await User.findByIdAndUpdate(user._id , {...user , action : 'sent-message-all'})
    bot.sendMessage(chatId ,  user.language == 'uz' ?`Siz hamma foydalanuvchilarga xabar yubormoqdasiz` : `Вы отправляете сообщение всем пользователям`,{
        reply_markup : {
            keyboard: [
                [
                    {
                        text:   user.language == 'uz' ? 'Xabar yuborishni yakunlash' :'Завершить отправку сообщения'
                        
                    }
                ]
            ],
            resize_keyboard: true
        
        }
        
    } )
}

const sentMessageToAllUsers = async (msg) => {
    const chatId = msg.from.id 
    const text  = msg.text
    const user = await User.findOne({chatId}).lean()

    if(text == 'Xabar yuborishni yakunlash' || text == 'Завершить отправку сообщения' ) {
    await User.findByIdAndUpdate(user._id , {...user , action : 'menu'})

        bot.sendMessage(chatId, user.language == 'uz' ? `Menyuni tanlang, ${user.admin ? 'Admin': user.full_name}`: `Выберите меню, ${user.admin ? 'Admin': user.full_name}`,{
            reply_markup: {
                keyboard: user.language == 'uz' ? adminKeyboardUZ : adminKeyboardRu ,
                resize_keyboard: true
            },
        })
    } else {
        let allUsers = await User.find({
            admin:false
        }).lean()
    
        allUsers.forEach(e => {
            bot.sendMessage(e.chatId , text)
        })
        bot.sendMessage(chatId , user.language == 'uz' ? 'Xabar yuborildi' : 'Сообщение отправлено' ,)
    }



}

const  sentGraficToUsers = async(msg) => {

    const chatId = msg.from.id 
    const user = await User.findOne({chatId}).lean()

    const sentAnswer = await  Promise.all(await sentAllOperatorGrafic(bot))
if(sentAnswer) {
    await  bot.sendMessage(chatId , user.language == 'uz' ? 'Grafiklar yuborildi' : 'Графики отправлено' )

    await bot.sendMessage(chatId, user.language == 'uz' ? `Menyuni tanlang, ${user.admin ? 'Admin': user.full_name}`: `Выберите меню, ${user.admin ? 'Admin': user.full_name}`,{
        reply_markup: {
            keyboard: user.language == 'uz' ? adminKeyboardUZ : adminKeyboardRu ,
            resize_keyboard: true
        },
    })
} else  {
    await  bot.sendMessage(chatId , user.language == 'uz' ? 'Grafiklar yuborilmadi' : 'Графики не отправлено' )

    await bot.sendMessage(chatId, user.language == 'uz' ? `Menyuni tanlang, ${user.admin ? 'Admin': user.full_name}`: `Выберите меню, ${user.admin ? 'Admin': user.full_name}`,{
        reply_markup: {
            keyboard: user.language == 'uz' ? adminKeyboardUZ : adminKeyboardRu ,
            resize_keyboard: true
        },
    })
}

}



module.exports= {
    ShowDepeartment,
    allAnswers,
    positiveAnswersMoth,
    rejectedAnswersMoth,
    allAnswersMoth,
    rejectedAnswers,
    positiveAnswers,
    allUsers,
    sentMessageToAllUsersMenu,
    sentMessageToAllUsers,
    sentGraficToUsers
}