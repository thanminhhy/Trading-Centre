const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('MMMM DD, h:mm a'),
  };
}

module.exports = formatMessage;
