import * as jwt from "jsonwebtoken";
import { WebSocket, RawData, Data } from "ws";
import { IncomingMessage } from "http";
import { Connection, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { Message } from "../model/userRequestModel";
async function connectUser(
  ws: WebSocket,
  req: IncomingMessage,
  db: Connection,
) {
  const authHeader =
    req.headers.authorization || (req.headers.Authorization as string);
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    );
    const email = (decoded as any).UserInfo.email;
    const [results] = await db.query<RowDataPacket[]>(
      "SELECT FROM user WHERE email = ?",
      [email],
    );
    if (results.length == 0) {
      return;
    }
    return { email, ws };
  } catch (err) {
    console.log(err);
  }
}

async function receiveMessage(ws: WebSocket, db: Connection, message: RawData) {
  const data: Message = JSON.parse(message.toString());
  try {
    const [results] = await db.query<ResultSetHeader>(
      "INSERT into messages (creator_id, receiver_id, content, created_at, group_receiver_id, is_reminder, remind_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        data.creator_id,
        data.receiver_id,
        data.content,
        data.created_at,
        data.group_receiver_id,
        data.is_reminder,
        data.remind_date,
      ],
    );
    if (results.affectedRows == 0) {
      return;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export { connectUser, receiveMessage };
