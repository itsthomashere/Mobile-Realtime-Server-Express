import { Request, Response } from "express";

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

export interface Message {
  creator_id: string;
  receiver_id: string;
  content: string;
  created_at: Date;
  group_receiver_id: string;
  is_reminder: boolean;
  remind_date: Date;
}
