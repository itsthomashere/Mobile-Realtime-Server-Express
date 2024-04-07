import mysql, { Connection, ConnectionOptions } from "mysql2/promise";

async function dbConnect(): Promise<Connection> {
  const connectionOptions: ConnectionOptions = {
    user: process.env.MYSQL_DATABASE_USER,
    host: process.env.MYSQL_DATABASE_HOST,
    password: process.env.MYSQL_DATABASE_PASSWORD,
    database: "ChatApp_DB",
    port: 3306,
  };
  const db = mysql.createConnection(connectionOptions);
  console.log("Connected to database");
  return db;
}

export default dbConnect;
