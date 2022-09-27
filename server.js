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
  updateChapters,
  deleteChapters
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

//GET

app.get("/api/chapters/:bookid", getChaptersById);

app.get("/api/users", getUsers);

app.get(`/api/users/:userid`, getUserById);

app.get("/api/userbooks/:userid", getBooksByUserID);

//POST

app.post("/api/books", createBooks);

app.post("/api/chapters", createChapter);

app.post("/api/users", createUser);

app.post("/api/username", handleLogin);

//DELETE

app.delete("/api/deletebooks/:bookid/:userid", deleteBooks);

app.delete("/api/deletechapters/:chapterid/:bookid", deleteChapters);

//PUT

app.put("/api/editbooks/:bookid/:userid", updateBooks);

app.put("/api/editchapters/:chapterid/:bookid", updateChapters);

app.listen(port, () => console.log(`Server running on ${port}`));