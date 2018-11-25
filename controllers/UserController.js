const models = require("../models/");
const utils = require("../utils.js");
require("dotenv").config();

class UserController {
  constructor(slackId) {
    this.slackId = slackId;
  }

  getCount() 
  {
    let theCount;
    models.User.count({ where: { slack_id: this.slackId } }).then(
      count => (theCount = count)
    );

    return theCount;
  }

  doesExist() 
  {
    let userCount = this.getCount();
    console.log(`The count in doesExist is: ${userCount}`);
    let doesExist = userCount > 0 ? true : false;
    console.log("Does user exist? " + doesExist);
    return doesExist;
  }

  setName(name) 
  {
    this.displayName = name;
  }

  saveToDatabase(slackId, displayName) 
  {
    let error;
    models.User.build({
      slack_id: slackId,
      name: displayName
    })
      .save()
      .catch(err => {
        error = err;
      });
  }
}

module.exports = UserController;
