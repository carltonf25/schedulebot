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
The `config.json` file needs a `development` environment set up with parameters to specify database login details. That will look something like this:

```
{
    "development": {
        "username": "your-username",
        "password": "your-password",
        "database": "your-db-name",
        "host": "your-hostname",
        "dialect": "postgres"
    }
}
```

## Set up a Postgres database
* You'll only need to create the database and a user to access it. The initial `npm start` of the app will create all necessary tables.
* Be sure to set up a user with the credentials specified in your `config.json` file and the necessary permissions to log in and create tables.

## Get  Access Token from Slack

Slack's reference for grabbing a token -- https://get.slack.help/hc/en-us/articles/215770388-Create-and-regenerate-API-tokens

Once you have an access token, set this as the value for your `SLACK_TOKEN` variable in your `.env` file.