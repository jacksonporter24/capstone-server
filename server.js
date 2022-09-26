require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const { Client } = require("pg");
const port = process.env.port || 8080;
const session = require("express-session");
const {
  getBooks,
  getBookById,
  getChaptersById,
  createBooks,
  createChapter,
  getUsers,
  createUser,
  getUserById,
  handleLogin,
  getBooksByUserID,
  updateBooks,
  deleteBooks,
} = require("./controller");

const app = express();

const db = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
db.connect();
app.set("db", db);

app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);

app.use(express.json());
app.use(cors());
app.use("/", express.static(path.join(__dirname, "./src")));
app.use(bodyParser.json());

// app.get("/api/books", getBooks);

// app.get(`/api/books/:bookid`, getBookById);

app.get("/api/chapters/:bookid", getChaptersById);

app.post("/api/books", createBooks);

app.post("/api/chapters", createChapter);

app.get("/api/users", getUsers);

app.get(`/api/users/:userid`, getUserById);

app.post("/api/users", createUser);

app.post("/api/username", handleLogin);

app.get("/api/userbooks/:userid", getBooksByUserID);

app.put("/api/editbooks/:bookid/:userid", updateBooks);

app.delete("/api/deletebooks/:bookid/:userid", deleteBooks);

app.listen(port, () => console.log(`Server running on ${port}`));
