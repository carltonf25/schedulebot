# scheduleBot
A slack bot that schedules messages. Built w/ NodeJS, Express, and Sequelize

## Setting up your .env and config.json files

After cloning the repo and running `npm install`, you'll need to set up a `.env` and a `config` directory containing a single `config.json` file.

The .env file will need to specify parameters for DB_NAME, DB_USER, DB_HOST, and SLACK_TOKEN, looking like this:

```
DB_NAME=your-db-name
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_HOST=your-hostname
DB_PORT=your-db-port
SLACK_TOKEN=your-slack-token
```