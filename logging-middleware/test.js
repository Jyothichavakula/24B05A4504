const { Log } = require("./index");

async function testLogger() {
  const result = await Log(
    "backend",
    "info",
    "handler",
    "Logging middleware test successful"
  );

  console.log(result);
}

testLogger();