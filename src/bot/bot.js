const TELEGRAM_BOT =  require('node-telegram-bot-api')

const bot = new TELEGRAM_BOT(process.env.TOKEN, {
    polling: true
})
// bot.on("message", (msg) => {
//   if (msg.video) {
//     console.log(msg.video.file_id); // Faylning ID sini konsolda chiqaradi
//   }
// });

module.exports = {
    bot
}


require('./message')
require('./query')