import { Request, Response } from "express";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

async function getInformation(db: Connection, req: Request, res: Response) {
  const { email } = req.body;
  try {
    const [results] = await db.query<RowDataPacket[]>(
      "SELECT * from user where user.email =?",
      [email],
    );
    if (results.length == 0) {
      return res.status(404).json({ message: "Could not find user" });
    }
    const data = results[0];
    return res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "An error occurred while fetching user information",
      error: error,
    });
  }
}

async function updateInformation(db: Connection, req: Request, res: Response) {
  const { email, password, username, firstname, lastname, phone, birthday } =
    req.body;
  try {
    const [results] = await db.query<RowDataPacket[]>(
      "SELECT * from user where user.email =?",
    );
    if (results.length == 0) {
      return res.status(404).json({ message: "Could not find user" });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({
      message: "An error occurred while fetching user information",
      error: error,
    });
  }
  try {
    const [results] = await db.query<ResultSetHeader>(
      "UPDATE user SET password = ?, username = ?, firstname = ?, lastname = ?, phone = ?, birthday = ? WHERE email = ?",
      [password, username, firstname, lastname, phone, birthday, email],
    );
    if (results.affectedRows == 0 || results.affectedRows == null) {
      return res.status(404).json({ message: "Could not update user" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: "Database query error", error: error });
  }
  return res.status(200).json({ message: "User updated successfully" });
}
export { getInformation, updateInformation };
