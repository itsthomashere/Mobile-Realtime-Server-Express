import { Connection, RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { Request, Response } from "express";
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

async function makeUserAdmin(db: Connection, req: Request, res: Response) {
  const { email, target_email, target_username } = req.body;
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
    const [results] = await db.query<RowDataPacket[]>(
      "SELECT * from user where user.email=? and user.username=?",
      [target_email, target_username],
    );
    if (results.length == 0) {
      return res.status(404).json({ message: "Could not find user" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Could not find user" });
  }

  try {
    const [results] = await db.query<ResultSetHeader>(
      "UPDATE user SET is_admin = true WHERE email = ? and username = ?",
      [target_email, target_username],
    );
    if (results.affectedRows == 0) {
      return res.status(404).json({ message: "Could not update user" });
    }
  } catch (error) {
    console.log(error);
  }
  return res
    .status(200)
    .json({ message: `User ${target_username} is now admin` });
}

async function deleteUser(db: Connection, req: Request, res: Response) {
  const { email } = req.body;
  const target_email = req.params.email;
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
    const [results] = await db.query<ResultSetHeader>(
      "DELETE FROM user WHERE email = ?",
      [target_email],
    );
    if (results.affectedRows == 0) {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Could not delete user" });
  }
  return res.status(200).json({ message: `User ${target_email} deleted` });
}

export { getAllUser, makeUserAdmin, deleteUser };
