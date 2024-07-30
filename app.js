const express = require(`express`);
const colors = require(`colors`);
const cookiParser = require(`cookie-parser`);
const cors = require(`cors`);
const path = require(`path`);

const app = express();

app.use(cors());
app.use(cookiParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

const appPages = require(`./routers/pages.routes`);
const authRoutes = require(`./routers/auth.routes`);

app.use(appPages);
app.use(`/api/v1/auth`, authRoutes);

// Define your routes here
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// route to handle 404 - Not Found or  wild card routes
// app.get("*", (req, res) => {
//   res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
// });

// errorHandling middlewares
app.use((error, req, res, next) => {
  console.log(error.stack);
  res.status(500).json({
    success: false,
    message: error.message,
  });
});

module.exports = app;
