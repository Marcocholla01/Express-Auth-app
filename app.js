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

const authRoutes = require(`./routers/auth.routes`);

app.use(`/api/v1/auth`, authRoutes);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Define your routes here
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Middleware to handle 404 - Not Found
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

module.exports = app;
