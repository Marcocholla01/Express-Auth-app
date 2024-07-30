// const cron = require("node-cron");
// const { promisify } = require("util");
// const { db } = require("../config/database");
// const query = promisify(db.query).bind(db);

// // Schedule task to run every minute
// const deleteUnverifiedUser = cron.schedule("* * * * *", async () => {
//   try {
//     const deleteQuery = `
//       DELETE FROM users
//       WHERE isVerified = 0
//       AND updatedAt < (NOW() - INTERVAL 60 MINUTE)
//     `;

//     // Execute the delete query
//     const result = await query(deleteQuery);

//     if (result.affectedRows > 0) {
//       console.log(
//         `Deleted ${result.affectedRows} unVerified users.`.yellow.italic
//       );
//     }
//   } catch (error) {
//     console.error(
//       `Error deleting unVerified users: ${error.message}`.red.italic
//     );
//   }
// });

// module.exports = { deleteUnverifiedUser };
