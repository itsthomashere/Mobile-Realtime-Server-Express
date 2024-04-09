require("dotenv").config();
import { Request, Response } from "express";
import { Connection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { mainSender } from "../utils/mailingServices";
import {
  hassingPassword,
  checkingHashedPassword,
} from "../utils/passwordCrypt";
import * as jwt from "jsonwebtoken";
async function loginUser(db: Connection, req: Request, res: Response) {
  const { email, password } = req.body;
  try {
    const [results] = await db.query<RowDataPacket[]>(
      "SELECT * from user where user.email=?",
      [email],
    );
    if (results.length == 0) {
      return res.status(400).json({ message: "User not found" });
    }
    if (
      !(await checkingHashedPassword(
        password,
        results[0].salt,
        results[0].password,
      ))
    ) {
      return res.status(400).json({ message: "Wrong password" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error while getting user", error: error });
  }
  const accessToken = jwt.sign(
    {
      UserInfo: {
        email: email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "5m" },
  );
  const refreshToken = jwt.sign(
    {
      UserInfo: {
        email: email,
        password: password,
      },
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "3d" },
  );
  try {
    const [results] = await db.query<ResultSetHeader>(
      "UPDATE user SET refresh_token = ? WHERE email = ?",
      [refreshToken, email],
    );
    if (results.affectedRows > 0) {
      return res.status(200).json({ message: "Login success", accessToken });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Login failed due to server problem" });
  }
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
    return res
      .status(500)
      .json({ message: "Something wrong when indexing known email" });
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
    // try query the results to check if the otp exists on the table
    const [results] = await db.query<RowDataPacket[]>(
      "SELECT * FROM user_otp WHERE email=? AND otp=? ORDER BY u_otp_id DESC",
      [email, otp],
    );
    // check if the the otp is invalid
    if (results.length == 0 || results[0].otp != otp) {
      return res.status(400).json({ message: "OTP not found or invalid" });
    }
    //check if the otp is expired
    const time_diff =
      (new Date().getTime() - results[0].created_at) / 1000 / 60;
    if (time_diff > 10) {
      await db.query<ResultSetHeader>(
        "DELETE FROM user_otp WHERE email=? AND otp=?",
        [email, otp],
      );
      return res.status(400).json({ message: "OTP expired" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error Code 2" });
  }
  //hashsing password and create user, save the salt to the user table
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
