import { Request, Response } from "express";
import { Connection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { mainSender } from "../utils/mailingServices";
import { hassingPassword } from "../utils/passwordCrypt";

async function loginUser(db: Connection, req: Request, res: Response) {
  const { email, password } = req.body;
}

async function registerOtpRequest(db: Connection, req: Request, res: Response) {
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

  const otp = Math.floor(100000 + Math.random() * 900000);
  const created_at = new Date();

  try {
    const [results] = await db.query<ResultSetHeader>(
      "INSERT INTO user_otp(email, otp , created_at) VALUES (?, ?, ?)",
      [email, otp, created_at],
    );
    if (results.affectedRows > 0) {
      let mailingResult = await mainSender(email, "OTP", otp);
      console.log(mailingResult);
      if (mailingResult?.accepted) {
        return res.status(200).json({ message: "OTP sent" });
      } else {
        return res.status(500).json({ message: "Email was not sent" });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function verifyRegister(db: Connection, req: Request, res: Response) {
  const { email, username, password, firstname, lastname, phone, otp } =
    req.body;
  try {
    const [results] = await db.query<RowDataPacket[]>(
      "SELECT * FROM user_otp WHERE email=? AND otp=? ORDER BY u_otp_id DESC",
      [email, otp],
    );
    if (results.length == 0) {
      return res.status(400).json({ message: "OTP not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error Code 2" });
  }
  const hashedPassword = await hassingPassword(password);
  try {
    const [results] = await db.query<ResultSetHeader>(
      "INSERT INTO user (email , username, password, phone , firstname, lastname, is_active, is_admin, otp_pending, salt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        email,
        username,
        hashedPassword.hashedPwd,
        phone,
        firstname,
        lastname,
        0,
        0,
        0,
        hashedPassword.salt,
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
export { loginUser, registerOtpRequest, verifyRegister };
