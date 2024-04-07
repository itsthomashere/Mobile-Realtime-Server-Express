import express, { Request, Response } from "express";
import { createUser, getAllUser } from "../controllers/userController";
import { Connection } from "mysql2/promise";
const router = express.Router();

class UserRoute {
  db: Connection;
  constructor(db: Connection) {
    this.db = db;
  }
  getAllUser = router.get("/user/all", (req: Request, res: Response) => {
    getAllUser(this.db, req, res);
  });
  createUser = router.post("/user", (req: Request, res: Response) => {
    createUser(this.db, (req = req), (res = res));
  });
}

export { UserRoute };
