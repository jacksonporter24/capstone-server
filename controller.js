const express = require("express");
const bcrypt = require("bcrypt");

const getBooks = (req, res) => {
  const db = req.app.get("db");
  db.query(`SELECT * FROM books;`)
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const getBookById = (req, res) => {
  const db = req.app.get("db");
  const bookid = req.params.bookid;
  console.log(`${bookid}`);
  db.query(`SELECT * FROM books WHERE "bookid" = ($1)`, [bookid])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const getChaptersById = (req, res) => {
  const db = req.app.get("db");
  const bookid = req.params.bookid;
  db.query(`SELECT * FROM chapters WHERE "bookid" = ($1)`, [bookid])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const createBooks = (req, res) => {
  const db = req.app.get("db");
  const { userId, title, description } = req.body;
  db.query(
    `INSERT INTO books("userid", "title", "description") VALUES ($1, $2, $3);`,
    [userId, title, description]
  )
    .then((dbRes) =>
      db
        .query(`SELECT * FROM books;`)
        .then((dbRes) => res.status(200).json(dbRes.rows))
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

const createChapter = (req, res) => {
  const db = req.app.get("db");
  const { chapternumber, chaptertitle, chapterdescription, bookid } = req.body;
  db.query(
    `INSERT INTO chapters("chapternumber", "chaptertitle", "chapterdescription", "bookid") VALUES ($1, $2, $3, $4);`,
    [chapternumber, chaptertitle, chapterdescription, bookid]
  )
    .then((dbRes) =>
      db
        .query(`SELECT * FROM chapters;`)
        .then((dbRes) => res.status(200).json(dbRes.rows))
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

const getUsers = (req, res) => {
  const db = req.app.get("db");
  db.query(`SELECT * FROM users;`)
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const getUserById = (req, res) => {
  const db = req.app.get("db");
  const userid = req.params.userid;
  console.log(`${userid}`);
  db.query(`SELECT * FROM users WHERE "userid" = ($1)`, [userid])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const createUser = async(req, res) => {
  const db = req.app.get("db");
  const { username, password, firstname, lastname } = req.body;

  const passwordHash = await bcrypt.hash(password, 10)
  
  const user = await db.query(
    `INSERT INTO users("username", "password", "firstname", "lastname") VALUES ($1, $2, $3, $4) RETURNING *;`,
    [username, passwordHash, firstname, lastname]
  )
    console.log(user)

    for(let i = 0; i < user.rows.length; i++) {
      delete user.rows[i].password
    }
    req.session.user = user.rows[0]
    res.status(200).json(user.rows[0])
};

module.exports = {
  getBooks,
  getBookById,
  getChaptersById,
  createBooks,
  createChapter,
  getUsers,
  createUser,
  getUserById,
};
