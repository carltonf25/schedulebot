const fetch = require("node-fetch");
require("dotenv").config();
const models = require("./models/");

// helper functions for making HTTP requests
exports.postData = (url, data) => 
{
    return fetch(url, {
      body: JSON.stringify(data),
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "content-type": "application/json"
      },
      method: "POST",
      mode: "cors",
      redirect: "follow",
      referrer: "no-referrer"
    }).then(response => response.json()); // parses response to JSON
};
  
exports.getData = url => 
{
    return fetch(url).then(response => response.json());
};
  
exports.deleteData = (url, data) => 
{
    return fetch(url, {
      body: JSON.stringify(data),
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "content-type": "application/json"
      },
      method: "DELETE",
      mode: "cors",
      redirect: "follow",
      referrer: "no-referrer"
    }).then(response => response.json());
}
  
 // Helper function to send ephemeral (only visible to user that asked) messages
exports.sendEphemeral = (text, channel, user) => 
{
    text = encodeURIComponent(text);
    exports.postData(`https://slack.com/api/chat.postEphemeral?token=${process.env.SLACK_TOKEN}&channel=${channel}&text=${text}&user=${user}&pretty=1`);
};

exports.doesExist = (slackId) =>
{
  models.User.count({ where: { slack_id: slackId} })
  .then(count => {
    if (count == 0 || !count) {
      console.log ('User does not exist.');
      return false;
    } else {
      console.log('User exists.');
      return true;
    }
  });
}
