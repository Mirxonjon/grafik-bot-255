const allOperatorsDate = require("../model/allOperatorsDate");
const User = require("../model/user");
const { readSheets } = require("./google_cloud");
const axios = require("axios");


const jobTime = [
  "07:00 - 16:00",
  ,
  "08:00 - 17:00",
  "9:00 - 18:00",
  "11:00 - 20:00",
  "13:00 - 22:00",
  "15:00 - 00:00",
  "17:00 - 02:00",
];
const DaysUz = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
  "Yakshanba",
];
const DaysRu = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];
const Supervayzers = [
  "Шавкатов Комолиддин",
  "Абсаловам Жахонгир",
  "Юсупрва Наргиза",
  "Исмаилова Нигора",
];

let dateDayObj = {
  1: 31,
  2: 29,
  3: 31,
  4: 30,
  5: 31,
  6: 30,
  7: 31,
  8: 31,
  9: 30,
  10: 31,
  11: 30,
  12: 31,
};

let InfoUserArr = [
  [
    "F.I.Sh",
    "Telefon raqam",
    "Ish vaqti",
    "Dam olish kunlari",
    "Sababi",
    `S'orovlar soni`,
    "Yuborilgan sana",
    `Admin Javobi`,
    "Admin Javob bergan vaqti",
  ],
];
function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Agar kun yoki oy bir xonali bo'lsa, oldiga 0 qo'shish
  day = day < 10 ? "0" + day : day;
  month = month < 10 ? "0" + month : month;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

const updateAllOperatorDate = async () => {
  const list = await readSheets("A:D");
  // console.log(list);
  const allOperators = await allOperatorsDate.find().lean();

  if (allOperators) {
    list?.forEach(async (e) => {
      if (e[0]) {
        let findOperator = await allOperatorsDate
          .findOne({ idNumberLogin: e[0] })
          .lean();
        if (!findOperator) {
          let newOperator = new allOperatorsDate({
            idNumberLogin: e[0],
            idNumber: e[0]?.split("|")[0],
            login: e[0].split("|")[1],
            full_name: e[1],
            number1: e[2],
            number2: e[3],
            createdAt: new Date(),
          });
          await newOperator.save();
        } else if (
          findOperator?.full_name != e[1] ||
          findOperator?.number1 == e[2] ||
          findOperator?.number2 == e[3]
        ) {
          await allOperatorsDate.findByIdAndUpdate(
            findOperator._id,
            {
              idNumber: e[0]?.split("|")[0],
              login: e[0].split("|")[1],
              full_name: e[1],
              number1: e[2],
              number2: e[3],
            },
            { new: true }
          );
        }
      }
    });
  } else {
    list?.forEach(async (e) => {
      let newOperator = new allOperatorsDate({
        idNumberLogin: e[0],
        idNumber: e[0]?.split("|")[0],
        login: e[0].split("|")[1],
        full_name: e[1],
        number1: e[2],
        number2: e[3],
        createdAt: new Date(),
      });

      await newOperator.save();
    });
  }
  return "true";
};

const sentAllOperatorGrafic = async (bot) => {
  const list = await readSheets("E:H");
  console.log(list.length);
  if (list) {
    const promises = list
      .filter((e, i) => i > 1)
      .map(async (e) => {
        try {
          if (e[0]?.length) {
            const findOperator = await User.findOne({ chatId: e[0] }).lean();
            if (findOperator) {
              await bot.sendMessage(
                findOperator.chatId,
                findOperator.language == "uz" ? `${e[1]}` : `${e[2]}`
              );
            } else {
              if (e[0]) {
                await bot.sendMessage(e[0], `${e[2]}`);
              }
            }
          }
        } catch (err) {
          console.error(`Error sending message to ${e[0]}:`, err.message);
          return err.message;
        }
      });
    return Promise.all(promises);
  } else {
    return [];
  }
};

const sentMessage = async (chatId, message) => {
  try {
    const botToken = process.env.TOKEN; 
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;


    const response = await axios.post(apiUrl, {
      chat_id: chatId,
      text: message,
    });


    return response.data;
  } catch (error) {
    // Xatolikni qayta ishlash
    console.error(`Error sending message to ${chatId}:`, error.message);
    throw new Error(`Error sending message to ${chatId}`);
  }
};

const deleteAllData = async () => {
  //   const chatId = msg.from.id;
  try {
    await allOperatorsDate.deleteMany({});
    // let text = `База данных удаленна`;
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
  }
};

// const sentAllOperatorGrafic = async (bot) => {
//   const list = await readSheets('E:H');

// for(i=0; i < 20 ;i++ ) {
// }
// if (list) {
//   const promises = list.filter((e, i) => i > 1).map(async (e) => {
//     const findOperator = await User.findOne({ chatId: e[0] }).lean();
//           if (findOperator) {
//               return bot.sendMessage(findOperator.chatId, findOperator.language == 'uz' ? `${e[1]}` : `${e[2]}`);
//           }
//       });
//       return Promise.all(promises);
//   } else {
//       return []; // Yoki boshqa maqul qiymat
//   }
// }

module.exports = {
  jobTime,
  DaysUz,
  DaysRu,
  formatDate,
  dateDayObj,
  InfoUserArr,
  updateAllOperatorDate,
  Supervayzers,
  sentAllOperatorGrafic,
  sentMessage,
  deleteAllData,
};
