const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const { RTMClient } = require("@slack/client");
const Sequelize = require("sequelize");
const models = require("./models");
const messagesRouter = require("./routes/messages");
const usersRouter = require("./routes/users");
const User = require("./controllers/UserController.js");
require("./scheduler.js");
const utils = require("./utils.js");

// Initialize express
const app = express();

// Set up routing middleware and routes
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/messages", messagesRouter);
app.use("/users", usersRouter);

const token = process.env.SLACK_TOKEN;

// Postgres connection url
const db = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${
  process.env.DB_HOST
}:5432/${process.env.DB_NAME}`;
const sequelize = new Sequelize(db);

// Connect to DB
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established!");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

// Initialize, then start Slack connection
const rtm = new RTMClient(token);
rtm.start();

// Listen for a Slack message in the workspace
rtm.on("message", message => {
  let messageJSON = JSON.stringify(message);
  const SlackUser = new User(message.user);

  // Skip bot messages or undefined user messages
  if (message.subtype === "bot_message" || message.user === "UAFV8NPSB" || message.user == undefined) {
    return;
  }

  // Find user or create a new one
  models.User.findOrCreate({
    where: {
      slack_id: message.user
    }
  })
  .spread((userResult, created) => {
    if (created) {
      console.log('user created with id: ' + message.user)
    } else {
      console.log('user already exists. moving on...')
    }
  })
  
  // Log the message to the server console
  console.log(`(type: ${message.type} channel:${message.channel}) ${
    message.user
  } says: ${message.text}
    request JSON: ${messageJSON}`);

  // 'help' response that gives tips on how to use the bot and a quick example message
  if (message.text.includes("<@UAFV8NPSB> help")) {
    rtm.sendMessage(
      `Beep, boop! This is ScheduleBot. To schedule a message, use the \`--text\` and \`--send_time\` parameters, like so:` +
        "\n\n" +
        `\`\`\`--text Hello, future Chimps! --send_time 10/26/2050 13:30\`\`\`` +
        "\n \n" +
        `To see your scheduled messages, simply ask \`show my scheduled messages\`.` +
        "\n \n" +
        `To delete a message, type: \`delete message --{message id}\``,
      message.channel
    );
  }

  // Schedule a message when --text & --send_time params are passed from Slack message
  if (message.text.toLowerCase().includes("--text")) {

        // Remove brackets added by slack for link formatting.
        let finalString = message.text
          .replace("/</g", " ")
          .replace("/>/g", " ");
        
        // send post request to /messages route, passing along the message text and channel it came from
        utils.postData(
            `http://${process.env.DB_HOST}:3000/messages/${SlackUser.slackId}`,
            {
              text: finalString,
              channel: message.channel
            }
          )
          .then(response => console.log(response))
          // Handle any errors with the request
          .catch(err => {
            console.error(err);
            utils.sendEphemeral(
              "There was an issue saving your message. If this persists, hit up Carlton.",
              message.channel,
              message.user
            );
            return;
          });
        // Success message
        utils.sendEphemeral(
          "Your message was scheduled!",
          message.channel,
          message.user
        );
      // });
  }

  // Retrieve messages for user that asked to see them
  if (message.text.toLowerCase().includes("show my scheduled messages")) {
    utils.getData(
        `http://${process.env.DB_HOST}:3000/messages/?user_slack_id=${message.user}&channel=${message.channel}`
      )
      .then(response => {
        if (response == "") {
          utils.sendEphemeral(
            `You don't have any messages scheduled, <@${message.user}>`,
            message.channel,
            message.user
          );
        } else {
          utils.sendEphemeral(
            `Here are your scheduled messages, <@${message.user}>: ` +
              "\n\n" +
              `${response}`,
            message.channel,
            message.user
          );
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  // User wants to delete a message
  if (message.text.toLowerCase().includes("delete message --")) {
    let messageText = message.text.toLowerCase();
    let messageIdIndex = messageText.search("--");
    let user = SlackUser.slackId;
    let messageId = messageText.substring(messageIdIndex + 2);

    utils.deleteData(
        `http://localhost:3000/messages/?message=${messageId}&user=${user}`
      )
      .catch(err => {
        utils.sendEphemeral("There was an error:" + err, message.channel);
        console.error(err);
        return;
      });

    //all went well, sending success message
    utils.sendEphemeral(
      `Message #${messageId} was deleted!`,
      message.channel,
      message.user
    );
  }
});

module.exports = app;
