const express = require("express");
const bcrypt = require("bcrypt");

//USERS:

//CREATE

const createUser = async (req, res) => {
  const db = req.app.get("db");
  const { username, password, firstname, lastname } = req.body;

  const salt = bcrypt.genSaltSync(5);
  const passwordHash = await bcrypt.hashSync(password, salt);

  const user = await db.query(
    `INSERT INTO users("username", "password", "firstname", "lastname") VALUES ($1, $2, $3, $4) RETURNING *;`,
    [username, passwordHash, firstname, lastname]
  );

  for (let i = 0; i < user.rows.length; i++) {
    delete user.rows[i].password;
  }
  req.session.user = user.rows[0];
  res.status(200).json(user.rows[0]);
};

//GET

const getUsersById = (req, res) => {
  const db = req.app.get("db");
  const userid = req.params.userid;
  db.query(`SELECT * FROM users WHERE "userid" = ($1)`, [userid])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const getUserById = (req, res) => {
  const db = req.app.get("db");
  const userid = req.params.userid;
  db.query(`SELECT * FROM users WHERE "userid" = ($1)`, [userid])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const getUsers = (req, res) => {
  const db = req.app.get("db");
  db.query(`SELECT * FROM users;`)
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

//OTHER

async function handleLogin(req, res) {
  try {
    let username = req.body.user;
    const db = req.app.get("db");
    const user = await db.query(
      `SELECT * FROM users WHERE username='${username}'`
    );
    if (!user.rows[0]) {
      return res.status(400).send("Please enter valid login credentials");
    }
    const authenticated = bcrypt.compareSync(
      req.body.password,
      user.rows[0].password
    );
    if (!authenticated) {
      return res.status(400).send("Please enter valid login credentials");
    }
    delete user.rows[0].password;
    if (authenticated) {
      req.session.user = user.rows[0];
    }
    return res.status(200).send(user.rows[0]);
  } catch (error) {
    res.status(500).send(error);
  }
}

//BOOKS:

//CREATE

const createBooksByUserId = (req, res) => {
  const db = req.app.get("db");
  const { userid, title, description } = req.body;
  db.query(
    `INSERT INTO books("userid", "title", "description") VALUES ($1, $2, $3);`,
    [+userid, title, description]
  )
    .then((dbRes) =>
      db
        .query(`SELECT * FROM books WHERE userid = ($1);`, [userid])
        .then((dbRes) => res.status(200).json(dbRes.rows))
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

const createBooks = (req, res) => {
  const db = req.app.get("db");
  const { userid, title, description } = req.body;
  db.query(
    `INSERT INTO books("userid", "title", "description") VALUES ($1, $2, $3);`,
    [userid, title, description]
  )
    .then((dbRes) =>
      db
        .query(`SELECT * FROM books WHERE userid = ($1);`, [userid])
        .then((dbRes) => res.status(200).json(dbRes.rows))
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

//EDIT

const updateBooks = (req, res) => {
  const db = req.app.get("db");
  const { bookid, userid } = req.params;
  const { title, description } = req.body;
  db.query(
    `UPDATE books SET title = ($2), description = ($3) WHERE bookid = ($1)`,
    [bookid, title, description]
  )
    .then((dbRes) =>
      db
        .query(`SELECT * FROM books WHERE userid = ($1);`, [userid])
        .then((dbRes) => res.status(200).json(dbRes.rows))
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

//DELETE

const deleteBooks = (req, res) => {
  const db = req.app.get("db");
  const { bookid, userid } = req.params;
  db.query(`DELETE FROM books WHERE bookid = ($1)`, [bookid])
    .then((dbRes) =>
      db
        .query(`SELECT * FROM books WHERE userid = ($1);`, [userid])
        .then((dbRes) => res.status(200).json(dbRes.rows))
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

//GET

const getBooks = (req, res) => {
  let username = req.body.userid;
  const db = req.app.get("db");
  db.query(`SELECT * FROM books WHERE userid = ($1);`, [username])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const getBooksByUserID = async (req, res) => {
  const db = req.app.get("db");
  const userid = req.params.userid;
  db.query(`SELECT * FROM books WHERE "userid" = ($1)`, [userid])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const getBookById = (req, res) => {
  const db = req.app.get("db");
  const bookid = req.params.bookid;
  db.query(`SELECT * FROM books WHERE "bookid" = ($1)`, [bookid])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

//CHAPTERS:

//CREATE

const createChapter = (req, res) => {
  const db = req.app.get("db");
  const { chapternumber, chaptertitle, chapterdescription, bookid } = req.body;
  db.query(
    `INSERT INTO chapters("chapternumber", "chaptertitle", "chapterdescription", "bookid") VALUES ($1, $2, $3, $4);`,
    [chapternumber, chaptertitle, chapterdescription, bookid]
  )
    .then((dbRes) =>
      db
        .query(`SELECT * FROM chapters WHERE bookid = ($1) ORDER BY chapternumber ASC;`, [bookid])
        .then((dbRes) => res.status(200).json(dbRes.rows))
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

//EDIT

const updateChapters = (req, res) => {
  const db = req.app.get("db");
  const { chapterid, bookid } = req.params;
  const { chapternumber, chaptertitle, chapterdescription } = req.body;
  console.log(chapternumber, chaptertitle, chapterdescription);
  db.query(
    `UPDATE chapters SET chapternumber = ($2), chaptertitle = ($3), chapterdescription = ($4) WHERE chapterid = ($1)`,
    [chapterid, chapternumber, chaptertitle, chapterdescription]
  )
    .then((dbRes) =>
      db
        .query(
          `SELECT * FROM chapters WHERE bookid = ($1) ORDER BY chapternumber ASC;`,
          [bookid]
        )
        .then((dbRes) => res.status(200).json(dbRes.rows))
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

//DELETE

const deleteChapters = (req, res) => {
  const db = req.app.get("db");
  const { chapterid, bookid } = req.params;
  db.query(`DELETE FROM chapters WHERE chapterid = ($1)`, [chapterid])
    .then((dbRes) =>
      db
        .query(`SELECT * FROM chapters WHERE bookid = ($1) ORDER BY chapternumber ASC;`, [bookid])
        .then((dbRes) => res.status(200).json(dbRes.rows))
        .catch((err) => console.log(err))
    )
    .catch((err) => console.log(err));
};

//GET

const getChaptersById = (req, res) => {
  const db = req.app.get("db");
  const bookid = req.params.bookid;
  db.query(`SELECT * FROM chapters WHERE "bookid" = ($1) ORDER BY chapternumber ASC`, [bookid])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
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
  handleLogin,
  getBooksByUserID,
  getUsersById,
  createBooksByUserId,
  updateBooks,
  deleteBooks,
  updateChapters,
  deleteChapters,
};
