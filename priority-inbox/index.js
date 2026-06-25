const fetchNotifications = require("./api");
const getTopNotifications = require("./priority");

async function main() {
  const notifications = await fetchNotifications();

  const topNotifications = getTopNotifications(notifications);

  console.log("\n========= TOP 10 PRIORITY NOTIFICATIONS =========\n");

  topNotifications.forEach((notification, index) => {
    console.log(`${index + 1}.`);

    console.log(`ID        : ${notification.ID}`);

    console.log(`Type      : ${notification.Type}`);

    console.log(`Message   : ${notification.Message}`);

    console.log(`Timestamp : ${notification.Timestamp}`);

    console.log("---------------------------------------");
  });
}

main();