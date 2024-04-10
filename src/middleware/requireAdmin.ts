import { NextFunction, Request, Response } from "express";
import { Connection, RowDataPacket } from "mysql2/promise";

async function requireAdmin(
  db: Connection,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { email } = req.body.email;
  try {
    const [results] = await db.query<RowDataPacket[]>(
      "SELECT * FROM user where email=? and is_admin is true",
      [email],
    );
    if (results.length == 1) {
      next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export { requireAdmin };
