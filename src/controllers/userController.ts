import { Request, Response } from "express";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";

async function getAllUser(db: Connection, req: Request, res: Response) {
  const { email } = req.body;
  try {
    const [results] = await db.query<RowDataPacket[]>(
      "SELECT * from user where user.email=? and user.is_admin is true",
      [email],
    );
    if (results.length == 0) {
      return res.status(404).json({ message: "You are not admin" });
    }
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Can not verify your identity" });
  }
  try {
    const [results] = await db.query<RowDataPacket[]>("SELECT * FROM user");
    if (results.length == 0) {
      return res.status(404).json({ message: "No user found" });
    }
    return res.status(200).json(results);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function createUser(db: Connection, req: Request, res: Response) {
  const { email, username, password, firstname, lastname, phone } = req.body;
  if (!email || !username || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const [results] = await db.query<RowDataPacket[]>(
      "SELECT * from user where user.email=?",
      [email],
    );
    if (results.length > 0) {
      console.log(results);
      return res.status(400).json({ message: "Email already exists" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }

  const is_active = 0;
  const is_admin = 0;
  const otp_pending = 0;
  try {
    const [results] = await db.query<ResultSetHeader>(
      "INSERT INTO user (email , username, password, phone , firstname, lastname, is_active, is_admin, otp_pending) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        email,
        username,
        password,
        phone,
        firstname,
        lastname,
        is_active,
        is_admin,
        otp_pending,
      ],
    );
    if (results.affectedRows > 0) {
      return res.status(201).json({ message: "User created successfully" });
    } else {
      return res.status(500).json({ message: "Something wrong happened" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Something wrong happened when creating user" });
  }
}

export { getAllUser, createUser };
