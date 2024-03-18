const  express = require('express')
const mongoose = require('mongoose')
const {CronJob} = require('cron')
const  cron = require('cron')
const { updateAllOperatorDate } = require('./src/utils/time')

// import { CronJob } from 'cron';
const app = express()
require('dotenv').config()

app.use(express.json())

require('./src/bot/bot')

const job = new CronJob(
	'9 * * * * *', // cronTime
    // '0 59 23 * * *',
	async () => {
        await updateAllOperatorDate(); 
      }, // onTick
	null, // onComplete
	true, // start
	'Asia/Tashkent' // timeZone
);
// const dt = cron.sendAt('* * * * *');
// console.log(`The job would run at: ${dt.toISO()}`);

async function dev() {
    try {
        mongoose.connect(process.env.MONGO_URL , {
            useNewUrlParser: true
        }).then(() => console.log('mongo connect'))
        .catch((error) => console.log(error))
        
        app.listen(process.env.PORT, () => {
            console.log('server is runing');
        })
    } catch (error) {
        console.log(error);
    }
}

dev()