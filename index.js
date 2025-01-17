const express = require("express");
const mongoose = require("mongoose");
const { CronJob } = require("cron");
const cron = require("cron");
const {
  updateAllOperatorDate,
  sentAllOperatorGrafic,
  sentMessage,
} = require("./src/utils/time");
const User = require("./src/model/user");
const { deleteAllData } = require("./src/bot/helper/application");

// import { CronJob } from 'cron';
const app = express();
require("dotenv").config();

app.use(express.json());

require("./src/bot/bot");

const job = new CronJob(
  // "9 * * * * *", // cronTime
  '0 59 23 * * *',
  async () => {
    await updateAllOperatorDate();
  }, 
  null, 
  true, 
  "Asia/Tashkent" 
);

async function dev() {
  try {
    mongoose
      .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
      })
      .then(() => console.log("mongo connect"))
      .catch((error) => console.log(error));

    app.listen(process.env.PORT, () => {
      console.log("server is runing");
    });

    await updateAllOperatorDate();
  } catch (error) {
    // console.log(error.message);
  }
}

dev();

app.get("/getAllUsers", async (req, res) => {
  const users = await User.find({ status: true }).lean();
  res.json({
    message: "ok",
    users,
  });
});

app.get("/updateOperators", async (req, res) => {
  // const users = await Applications.find().populate('user').lean()
  //  console.log(users);

  await updateAllOperatorDate();
  res.json({
    message: "update",
  });
});

app.get("/deleteAllData", async (req, res) => {
  // const users = await Applications.find().populate('user').lean()
  //  console.log(users);

  await deleteAllData();
  res.json({
    message: "delete",
  });
});

app.post("/send-message", async (req, res) => {
  const { chatId, message } = req.body
  console.log(chatId , message);
  
  await sentMessage(chatId , message);

  res.json({
    message: "sended message",
  });
});
