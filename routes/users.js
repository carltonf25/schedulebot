var express = require("express");
var router = express.Router();
const models = require("../models");
const utils = require('../utils.js')
const User = require("../controllers/UserController.js");

router.get("/", (req, res) => {
  models.User.findAll()
    .then(users => {
      rtm.sendMessage(`Here are all the users: `, message.channel);
      let userArray = [];
      users.forEach(user => {
        userArray.push(user.name);
      });
      console.log(userArray);
      // build a string from the array of stored messages
      let userString = ``;
      userArray.map(user => {
        userString += user + "\n";
      });
      // Send messageString back to user in Slack
      rtm.sendMessage(`${userString}`, message.channel);
    })
    .catch(console.error);
});

// Get display name from Slack
router.get('/name', (req, res) => {
  let slackId = req.query.slackId;

  utils.getData(`https://slack.com/api/users.info?user=${slackId}&token=${process.env.SLACK_TOKEN}`)
  .then( userData => userData.user.profile.display_name)
  .then( theName => res.json({name: theName}))
  .catch(err => res.json({error: err}))
})

/* Old route for creating a new user. 
Replacing with findOrCreate() model method for now */

// router.post("/", (req, res) => {
//   createUser = new Promise((resolve, reject) => {
//     let newUser = new User(req.body.slack_id);
//     let displayName = newUser.getSlackDislayName || "name-not-found";
//     newUser.saveToDatabase(newUser.slackId, displayName);
//   });
//   createUser.then(res.json({ text: "user created" })).end();
// });

module.exports = router;
