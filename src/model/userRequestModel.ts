import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

export interface UserRegisterRequest extends Request {
  email: string;
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  phone: string;
}
export interface UserLoginRequest extends Request {
  email: string;
  username: string;
  password: string;
}

export interface UserRequest extends Request {
  email: string;
}
export interface JWTPayLoad {
  UserInfo: {
    email: string;
  };
}
