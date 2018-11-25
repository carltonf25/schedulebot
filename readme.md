  1 # scheduleBot
  2 A slack bot that schedules messages. Built w/ NodeJS, Express, and Sequelize
  3
  4 ## Setting up your .env and config.json files
  5
  6 After cloning the repo and running `npm install`, you'll need to set up a `.env` and a `config` directory     containing a single `config.json` file.
  7
  8 The .env file will need to specify parameters for DB_NAME, DB_USER, DB_HOST, and SLACK_TOKEN, looking lik    e this:
  9
 10 ```
 11 DB_NAME=your-db-name
 12 DB_USER=your-db-username
 13 DB_PASSWORD=your-db-password
 14 DB_HOST=your-hostname
 15 DB_PORT=your-db-port
 16 SLACK_TOKEN=your-slack-token
"readme.md" 42L, 1507C
