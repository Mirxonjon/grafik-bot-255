const adminKeyboardUZ = [
    [
        {
            text:'So‘rovnomalar'
        },
    ],
    [
        {
            text:'Statistika'
        },
        
        {
            text:`Xabar yuborish`
        },
    ],
    [
        {
            text : 'Grafik yuborish'
        },
        {
            text:`🇷🇺/🇺🇿 Tilni o‘zgartirish`
        }
    ]
]
const adminKeyboardRu = [
    [
        {
            text:'Запросы'
        },
    ],
    [
        {
            text:'Статистика'
        },
        {
            text:'Отправит сообшения'
        },
    ],
    [
        {
            text : 'Отправит график'
        },
        {
            text:`🇷🇺/🇺🇿 Сменить язык`
        }
    ]
]

const userKeyboardUz = [
    [
        {
            text:`So‘rovnoma qoldirish`
        },
        {
            text:`🇷🇺/🇺🇿 Tilni o‘zgartirish`
        }
    ]
]

const userKeyboardRU = [
    [
        {
            text:`Оставить запрос`
        },
        {
            text:`🇷🇺/🇺🇿 Сменить язык`
        }
    ]
]

const timeKeyboard = [
    [
        {
            text: '07:00 - 16:00',
            callback_data: 'time_07:00 - 16:00'
        },
        {
            text: '08:00 - 17:00',
            callback_data: 'time_08:00 - 17:00'
        },
        {
            text: '9:00 - 18:00',
            callback_data: 'time_9:00 - 18:00'
        }
    ],
    [
        {
            text: '11:00 - 20:00',
            callback_data: 'time_11:00 - 20:00'
        },
        {
            text: '13:00 - 22:00',
            callback_data: 'time_13:00 - 22:00'
        },
        {
            text: '15:00 - 00:00',
            callback_data: 'time_15:00 - 00:00'
        },
    ],
    [
        {
            text: '17:00 - 02:00',
            callback_data: 'time_17:00 - 02:00'
        },
        {
            text: 'Смена',
            callback_data: 'time_08:00 - 20:00'
        }
    ],
]

const daysKeyboard = async (user) => {
 return await [ 
    [
        { 
            text: user.language == 'uz' ? 'Dushanba' : 'Понедельник' ,
            callback_data: 'day_off-Monday'
        } ,
        { 
            text:  user.language == 'uz' ? 'Seshanba' : 'Вторник',
            callback_data: 'day_off-Tuesday'
        } 
    ],
    [
        { 
            text: user.language == 'uz' ?  'Chorshanba' : 'Среда',
            callback_data: 'day_off-Wednesday'
        },

        { 
            text: user.language == 'uz' ?  'Payshanba' : 'Четверг',
            callback_data: 'day_off-Thursday'
        }  
    ],
    [
        { 
            text: user.language == 'uz' ?  'Juma' : 'Пятница' ,
            callback_data: 'day_off-Friday'
        },
        { 
            text: user.language == 'uz' ?  'Shanba' : 'Суббота',
            callback_data: 'day_off-Saturday'
        }  
    ],
    [
        { 
            text: user.language == 'uz' ?  'Yakshanba' : 'Воскресенье',
            callback_data: 'day_off-Sunday'
        },
        {
            text: user.language == 'uz' ? 'Ortga qaytish' : 'Назад'
        }  
    ]
]
}

const statisticKeyboardUz = [
    [
        {
            text : 'Hal etilganlar'
        },
        {
            text: 'Rad etilganlar'
        }
    ],
    [
        {
            text: 'Hammasi'
        },
        
    ],
    [
        {
            text :"Foydalanuvchilar" 
        },
    ],
    [
        {
            text :"Menyu" 
        },
    ]
]

const statisticKeyboardRu = [
    [
        {
            text : 'Решено'
        },
        {
            text: 'Отклоненный'
        }
    ],
    [
        {
            text: 'Все'
        },
        
    ],
    [
        {
            text :"Пользователи" 
        },
    ],
    [
        {
            text :"Меню" 
        },
    ]
]

const CalendarKeyboardUz = [
    [
        {
            text : 'Yanvar',
            info: '01'

        },
        {
            text: 'Fevral',
            info: '02'
        },
        {
            text: 'Mart',
            info: '03'
        },
    ],
    [
        {
            text : 'Aprel',
            info: '04'

        },
        {
            text: 'May',
            info: '05'
        },
        {
            text: 'Iyun',
            info: '06'
        },
    ],
    [
        {
            text : 'Iyul',
            info: '07'

        },
        {
            text: 'Avgust',
            info: '08'
        },
        {
            text: 'Sentyabr',
            info: '09'
        },
    ],
    [
        {
            text : 'Oktyabr',
            info: '10'

        },
        {
            text: 'Noyabr',
            info: '11'
        },
        {
            text: 'Dekabr',
            info: '12'
        },
    ],

]

const CalendarKeyboardRu = [
    [
        {
            text : 'Январь',
            info: '01'

        },
        {
            text: 'Февраль',
            info: '02'
        },
        {
            text: 'Март',
            info: '03'
        },
    ],
    [
        {
            text : 'Апрель',
            info: '04'

        },
        {
            text: 'Май',
            info: '05'
        },
        {
            text: 'Июнь',
            info: '06'
        },
    ],
    [
        {
            text : 'Июль',
            info: '07'

        },
        {
            text: 'Август',
            info: '08'
        },
        {
            text: 'Сентябрь',
            info: '09'
        },
    ],
    [
        {
            text : 'Октябрь',
            info: '10'

        },
        {
            text: 'Ноябрь',
            info: '11'
        },
        {
            text: 'Декабрь',
            info: '12'
        },
    ],

]

const SupervayzerKeyboard = [
    [
        {
            text:`Шавкатов Комолиддин`
        },
        {
            text:`Абсаловам Жахонгир`
        }
    ],
    [
        
        {
            text:`Юсупрва Наргиза`
        },
        {
            text:`Исмаилова Нигора`
        }
    ]
]

module.exports = {
    adminKeyboardUZ,
    adminKeyboardRu,
    userKeyboardUz,
    userKeyboardRU,
    timeKeyboard,
    daysKeyboard,
    statisticKeyboardUz,
    statisticKeyboardRu,
    CalendarKeyboardUz,
    CalendarKeyboardRu,
    SupervayzerKeyboard
}