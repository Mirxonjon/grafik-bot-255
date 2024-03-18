const allOperatorsDate = require("../model/allOperatorsDate")
const User = require("../model/user")
const { readSheets } = require("./google_cloud")

const jobTime =  ['07:00 - 16:00', ,  '08:00 - 17:00', '9:00 - 18:00', '11:00 - 20:00',   '13:00 - 22:00' , '15:00 - 00:00',  '17:00 - 02:00',  ]
const DaysUz = ['Dushanba', 'Seshanba',  'Chorshanba', 'Payshanba' ,  'Juma'  ,'Shanba' ,'Yakshanba' ]
const DaysRu = ['Понедельник',  'Вторник', 'Среда' ,  'Четверг'  ,'Пятница'  , 'Суббота'  , 'Воскресенье' ]
const Supervayzers = ['Шавкатов Комолиддин' , 'Абсаловам Жахонгир' , 'Юсупрва Наргиза' , 'Исмаилова Нигора']

let dateDayObj = {
  "1" : 31,
  "2" : 29,
  "3" : 31,
  "4" : 30,
  "5" : 31,
  "6" : 30,
  "7" : 31,
  "8" : 31,
  "9" : 30,
  "10" : 31,
  "11" : 30,
  "12" : 31,
}

let InfoUserArr = [
  [
      'F.I.Sh',
      'Telefon raqam',
      'Ish vaqti',
      'Dam olish kunlari',
      'Sababi' ,
      `S'orovlar soni`,
      'Yuborilgan sana',
      `Admin Javobi`,
      'Admin Javob bergan vaqti'
  ]
]
function formatDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1; 
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
  
    // Agar kun yoki oy bir xonali bo'lsa, oldiga 0 qo'shish
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
  
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }

  const updateAllOperatorDate = async () => {
    const list = await readSheets('A:D')
    // console.log(list);
    const allOperators = await allOperatorsDate.find().lean()

    if(allOperators) {
      list?.forEach(async e => {
        if(!isNaN(+e[0])) {

       let findOperator = await allOperatorsDate.findOne({idNumber : e[0]  , }).lean()

        if(!findOperator){
          let newOperator = new allOperatorsDate({
            idNumber : e[0],
            full_name : e[1],
            number1: e[2] ,
            number2: e[3] ,
            createdAt: new Date(),
        })
        await newOperator.save()
        } else if(findOperator?.full_name != e[1] || findOperator?.number1 == e[2] || findOperator?.number2 == e[3] ) {
         await allOperatorsDate.findByIdAndUpdate(findOperator._id,{full_name : e[1] , number1: e[2], number2: e[3] },{new:true})
        }
      }
      })

    }else {
      list?.forEach(async e => {
    
           let newOperator = new allOperatorsDate({
             idNumber : e[0],
             full_name : e[1],
             number1: e[2] ,
             number2: e[3] ,
             createdAt: new Date(),
         })

         await newOperator.save()
        })
    }
    return 'true'
  } 


  const sentAllOperatorGrafic = async (bot) => {
    const list = await readSheets('E:H');

  for(i=0; i < 20 ;i++ ) {
  }
  if (list) {
    const promises = list.filter((e, i) => i > 1).map(async (e) => {
      const findOperator = await User.findOne({ chatId: e[0] }).lean();
            if (findOperator) {
                return bot.sendMessage(findOperator.chatId, findOperator.language == 'uz' ? `${e[1]}` : `${e[2]}`);
            }
        });
        return Promise.all(promises);
    } else {
        return []; // Yoki boshqa maqul qiymat
    }
}



  


  
module.exports = {
    jobTime,
    DaysUz,
    DaysRu,
    formatDate,
    dateDayObj,
    InfoUserArr,
    updateAllOperatorDate,
    Supervayzers,
    sentAllOperatorGrafic
}