import express, { Request, Response } from "express";
import { createUser, getAllUser } from "../controllers/userController";
import { Connection } from "mysql2/promise";
import {
  loginUser,
  registerOtpRequest,
  verifyRegister,
} from "../controllers/authController";
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
  registerRequest = router.post("/register", (req: Request, res: Response) => {
    registerOtpRequest(this.db, req, res);
  });
  registerVerify = router.post(
    "/register/verify",
    (req: Request, res: Response) => {
      verifyRegister(this.db, req, res);
    },
  );
}

class AuthRoute {
  db: Connection;
  constructor(db: Connection) {
    this.db = db;
  }
  login = router.post("/login", (req: Request, res: Response) => {
    loginUser(this.db, req, res);
  });
}

export { AuthRoute, UserRoute };
