const express = require("express");
const bcrypt = require("bcrypt");

const getBooks = (req, res) => {
  let username = req.body.userid
  const db = req.app.get("db");
  db.query(`SELECT * FROM books WHERE userid = ($1);`, [username])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const getBooksByUserID = async (req, res) => {
  console.log("hit the get books user id");
  const db = req.app.get("db");
  const userid = req.params.userid;
  console.log("this should be userid", userid);
  db.query(`SELECT * FROM books WHERE "userid" = ($1)`, [userid])
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

const getUsersById = (req, res) => {
  const db = req.app.get("db");
  const userid = req.params.userid;
  console.log(`${userid}`);
  db.query(`SELECT * FROM users WHERE "userid" = ($1)`, [userid])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const getBookById = (req, res) => {
  const db = req.app.get("db");
  const bookid = req.params.bookid;
  console.log(`${bookid}`);
  console.log("getbook by id hit");
  db.query(`SELECT * FROM books WHERE "bookid" = ($1)`, [bookid])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const createBooksByUserId = (req, res) => {
  const db = req.app.get("db");
  const { userid, title, description } = req.body;
  // userid = +userid
  console.log(req.body);
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

const createChapter = (req, res) => {
  const db = req.app.get("db");
  const { chapternumber, chaptertitle, chapterdescription, bookid } = req.body;
  db.query(
    `INSERT INTO chapters("chapternumber", "chaptertitle", "chapterdescription", "bookid") VALUES ($1, $2, $3, $4);`,
    [chapternumber, chaptertitle, chapterdescription, bookid]
  )
    .then((dbRes) =>
      db
        .query(`SELECT * FROM chapters WHERE bookid = ($1);`, [bookid])
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
  console.log(`'this is the getuser by id function', ${userid}`);
  db.query(`SELECT * FROM users WHERE "userid" = ($1)`, [userid])
    .then((dbRes) => res.status(200).json(dbRes.rows))
    .catch((err) => console.log(err));
};

const createUser = async (req, res) => {
  const db = req.app.get("db");
  const { username, password, firstname, lastname } = req.body;

  const salt = bcrypt.genSaltSync(5);
  const passwordHash = await bcrypt.hashSync(password, salt);
  console.log(passwordHash);

  const user = await db.query(
    `INSERT INTO users("username", "password", "firstname", "lastname") VALUES ($1, $2, $3, $4) RETURNING *;`,
    [username, passwordHash, firstname, lastname]
  );
  console.log(user);

  for (let i = 0; i < user.rows.length; i++) {
    delete user.rows[i].password;
  }
  req.session.user = user.rows[0];
  res.status(200).json(user.rows[0]);
};

async function handleLogin(req, res) {
  try {
    let username = req.body.user;
    console.log("UserName - " + username);
    const db = req.app.get("db");
    // const [user1] = await db.user1.where('email=$1 OR username=$1', [req.body.username])
    const user = await db.query(
      `SELECT * FROM users WHERE username='${username}'`
    );
    if (!user.rows[0]) {
      console.log("Non valid Creds");
      return res.status(400).send("Please enter valid login credentials");
    }
    console.log("this is", user.rows[0]);
    const authenticated = bcrypt.compareSync(
      req.body.password,
      user.rows[0].password
    );
    console.log(user.rows[0].password);
    if (!authenticated) {
      console.log("Non valid Creds");
      return res.status(400).send("Please enter valid login credentials");
    }
    console.log("this is the res.status", res.status);
    delete user.rows[0].password;
    if (authenticated) {
      console.log("authenticated");
      req.session.user = user.rows[0];
    }
    return res.status(200).send(user.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
}

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
};
