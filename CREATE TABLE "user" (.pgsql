CREATE TABLE "user" (
  userId SERIAL PRIMARY KEY,
  username VARCHAR(100),
  firstName VARCHAR(50),
  lastName VARCHAR(50)
);

CREATE TABLE books(
  booId SERIAL PRIMARY KEY,
  title VARCHAR (100),
  description VARCHAR(10000),
  userId REFERENCES user(userId)
);