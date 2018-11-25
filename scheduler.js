const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const CronJob = require("cron").CronJob;
const models = require("./models");
const { RTMClient } = require("@slack/client");

// Initialize Slack client
const token = process.env.SLACK_TOKEN;
const rtm = new RTMClient(token);
rtm.start();

/* Cron Job to send scheduled messages
Will run every 15 minutes, Monday-Sunday (Runs every 2 minutes while in testing) 
*/
const scheduler = new CronJob({
  cronTime: "*/2 * * * *",
  onTick: () => {
    let currentTime = new Date();
    models.Message.findAll({
      where: { has_sent: false, send_time: { [Op.lte]: currentTime } }
    })
    .then(messagesToSend => {
      console.log(messagesToSend);
      messagesToSend.forEach(message => {
        models.Message.update(
          { has_sent: true },
          { where: { id: message.id } }
        );
        rtm.sendMessage(
          `<@${message.UserSlackId}> scheduled this message:` +
            "\n\n" +
            `${message.text}`,
          message.channel
        );
      });
    });
  },
  start: false,
  timeZone: "America/New_York"
});
console.log("Starting scheduler cron");
scheduler.start();

module.exports = scheduler;
