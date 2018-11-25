const express = require("express");
const router = express.Router();
const models = require("../models");
const app = require("../app");

// Return all scheduled messages for a user
router.get("/", (req, res, next) => {
  models.Message.findAll({
    where: { UserSlackId: req.query.user_slack_id, has_sent: false }
  })
    .then(messages => {
      let messageArray = [];
      messages.forEach(message => {
        messageArray.push({
          text: message.text,
          id: message.id,
          send_time: message.send_time
        });
      });
      console.log(messageArray);
      // build a string from the array of stored messages
      let messageString = ``;
      messageArray.map(message => {
        messageString +=
          `- [${message.id}] ${message.text} (sending at: ${
            message.send_time
          })` + "\n";
      });
      return messageString;
    })
    .then(response => res.json(response))
    .catch(err => console.error(err));
});

// Schedule a new message for a specific user
router.post("/:slack_id", (req, res) => {
  // Get full text of message from slack, then index location of each parameter
  let fullTextOfMessage = req.body.text;
  let textIndex = fullTextOfMessage.search("--text ");
  let sendTimeIndex = fullTextOfMessage.search("--send_time ");

  //Build substrings for each parameter to send back to DB
  let messageText = fullTextOfMessage.substring(textIndex + 7, sendTimeIndex);
  let messageSendTime = fullTextOfMessage.substring(sendTimeIndex + 12,fullTextOfMessage.length);

  // Grab the channel to send to from the request
  let messageChannel = req.body.channel;

  // Build message to insert into DB
  let messageToSave = models.Message.build({
    text: messageText,
    send_time: messageSendTime,
    UserSlackId: req.params.slack_id,
    has_sent: false,
    channel: messageChannel
  });
  // Save the new message
  messageToSave
    .save()
    .then(newMessage => {
      console.log("Inserting message: " + newMessage.text);
    })
    .catch(err => {
      console.error(err);
    })
    .then(res.json({ body: "Message inserted!" }));
});

// Delete a scheduled message
router.delete("/", (req, res) => {
  let messageId = req.query.message;
  let user = req.query.user;
  console.log(messageId);

  models.Message.destroy({ where: { id: messageId } })
    .then(res.json({ message: "Message successfully deleted!" }))
    .catch(err => console.log(err));
});

module.exports = router;
