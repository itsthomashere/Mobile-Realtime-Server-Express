import * as database from "mysql2";

function dbConnect(): void {
  const mysql = database.createConnection({
    host: process.env.MYSQL_DATABASE_HOST,
    user: process.env.MYSQL_DATABASE_USER,
    password: process.env.MYSQL_DATABASE_PASSWORD,
    port: 3005,
    database: "Chat_App",
  });
  mysql.connect((err) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log(
        `Connected to MySQL with user ${process.env.MYSQL_DATABASE_USER} on ${process.env.MYSQL_DATABASE_HOST}`,
      );
    }
  });
}

export default dbConnect;
