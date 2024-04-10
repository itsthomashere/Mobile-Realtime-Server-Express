import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";

function verifyJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader: string =
    req.headers.authorization || String(req.headers.Authorization);
  if (!authHeader?.startsWith("Bearer ")) {
    return res.sendStatus(401);
  }
  const accessToken = authHeader.split(" ")[1];
  try {
    jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as string,
      function (err, decoded) {
        if (err) {
          return res.status(403).json({ message: "Token expired", error: err });
        }
        req.body.email = (decoded as any).UserInfo.email;
        next();
      },
    );
  } catch (error) {
    console.log(error);
    return res.status(403).json({ message: "Could not verify token" });
  }
}

export { verifyJWT };
