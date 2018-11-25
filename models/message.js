'use strict';
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    text: DataTypes.STRING(4000),
    send_time: DataTypes.DATE,
    has_sent: DataTypes.BOOLEAN,
    channel: DataTypes.STRING

  }, {});
  Message.associate = function(models) {
    // associations can be defined here
    Message.belongsTo(models.User);
  };
  return Message;
};