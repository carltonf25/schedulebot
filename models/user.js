'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    slack_id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    name: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Message);
  };
  return User;
};