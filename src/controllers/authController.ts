import { Request, Response } from "express";
import { Connection, RowDataPacket } from "mysql2/promise";

async function loginUser(db: Connection, req: Request, res: Response) {
  const { email, password } = req.body;
}

async function registerUser(db: Connection, req: Request, res: Response) {
  const { email, user, password, fistname, lastname, phone } = req.body;
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
}
