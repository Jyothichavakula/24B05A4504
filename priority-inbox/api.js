const data = require("./notifications.json");

async function fetchNotifications() {
  return data.notifications;
}

module.exports = fetchNotifications;