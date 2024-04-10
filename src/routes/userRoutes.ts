import express, { Request, Response } from "express";
import {
  getInformation,
  updateInformation,
} from "../controllers/userController";
import { Connection } from "mysql2/promise";
import {
  loginUser,
  registerOtpRequest,
  verifyRegister,
} from "../controllers/authController";
import { verifyJWT } from "../middleware/verifyJWT";
import {
  deleteUser,
  getAllUser,
  makeUserAdmin,
} from "../controllers/adminController";
const router = express.Router();

class UserRoute {
  db: Connection;
  constructor(db: Connection) {
    this.db = db;
  }
  registerRequest = router.post("/register", (req: Request, res: Response) => {
    registerOtpRequest(this.db, req, res);
  });
  registerVerify = router.post(
    "/register/verify",
    (req: Request, res: Response) => {
      verifyRegister(this.db, req, res);
    },
  );
  getInformation = router.get(
    "/user/info",
    verifyJWT,
    (req: Request, res: Response) => {
      getInformation(this.db, req, res);
    },
  );
  updateInformation = router.put(
    "/user/update",
    verifyJWT,
    (req: Request, res: Response) => {
      updateInformation(this.db, req, res);
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
class AdminRoute {
  db: Connection;
  constructor(db: Connection) {
    this.db = db;
  }
  getAllUser = router.get(
    "/admin/user/all",
    verifyJWT,
    (req: Request, res: Response) => {
      getAllUser(this.db, req, res);
    },
  );
  makeAdmin = router.post(
    "/admin/make",
    verifyJWT,
    (req: Request, res: Response) => {
      makeUserAdmin(this.db, req, res);
    },
  );
  deleteUser = router.delete(
    "/admin/delete/:email",
    verifyJWT,
    (req: Request, res: Response) => {
      deleteUser(this.db, req, res);
    },
  );
}

export { AuthRoute, UserRoute, AdminRoute };
