import { error } from 'console';
import { Request , Response  } from 'express';
import * as jwt from 'jsonwebtoken'
function ( req : Request, res : Response, next : NextFunction) {
  const authHeader : string = req.headers.authorization || String(req.headers.Authorization)
  if (!authHeader?.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }
  const accessToken = authHeader.split(' ')[1];

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (err, decoded ) => {
    if(err) {
      return res.sendStatus(403).json({message : 'invalid token', error : err});
    }   

    req.body.email = decoded.UserInfo.email;

  })
}
