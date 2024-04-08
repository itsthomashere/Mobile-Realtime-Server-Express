import { NextFunction, Request, Response } from "express";
import { Connection, RowDataPacket } from "mysql2/promise";

async function verifyOtp(
  db: Connection,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const email = req.body.email;
  const otp = req.body.otp;
  try {
    const [result] = await db.query<RowDataPacket[]>(
      "SELECT * FROM user_otp WHERE email=?",
      [email],
    );

    if (result.length > 0) {
      return res.status(500).json({ message: "User already created" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}
