const { bot } = require("./bot");
const { addApplication, answerApplication, ApplicationChat } = require("./helper/application");
const { addName } = require("./helper/start");
const { positiveAnswers, rejectedAnswers, allAnswers } = require("./helper/statistic");

bot.on('callback_query', async (query) => {


    const { data } = query;

    // let id = data.split('-');
    let callbackName = data.split('_');


    bot.answerCallbackQuery(query.id , {
        cache_time :0.5
    }).then(() => {
        if(callbackName[0] == 'add-name'){
            addName(query)
        }
        if(callbackName[0] == 'appliaction'){
            answerApplication(query)
        }
        if(callbackName[0] == 'applicationChat') {
            ApplicationChat(query)
        }
        if(callbackName[0] == 'positive') {
            positiveAnswers(query)
        }
        if(callbackName[0] == 'rejected') {
            rejectedAnswers(query)
        }
        if(callbackName[0] == 'answerAll') {
            allAnswers(query)
        }
          
                

    }).catch(e => {
        console.log(e);
    })
})