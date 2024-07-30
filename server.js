const app = require(`./app`);
const { port } = require("./config/config");
const { checkDbConnection } = require("./config/database");
const { deleteUnverifiedUser } = require("./middlewares/taskScheduler");

// Handle Uncaught Exception
process.on(`uncaughtException`, (error) => {
  console.log(`ERROR: ${error.stack}`.red.italic);
  console.log(`shutting down the server for handling uncaught exception`);
});

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// deleting unverified User
deleteUnverifiedUser.start();

// Database Connection
checkDbConnection();

// create server
const server = app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`.magenta.italic);
  console.log(
    `Project home page: https://auth-it.onrender.com`.magenta.italic
  );
});

// unhandled promise rejection
process.on(`unhandledRejection`, (error) => {
  console.log(`shutting down the server for ${error.stack}`.red.italic);
  console.log(`shutting down the server for unhandled promise rejection`);

  // then close the server
  server.close(() => {
    process.exit(1);
  });
});
