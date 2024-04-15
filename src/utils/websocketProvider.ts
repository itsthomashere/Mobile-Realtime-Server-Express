import { IncomingMessage } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { Connection } from "mysql2/promise";
import { connectUser, receiveMessage } from "./websocketUtils";

class websocketProvider {
  clients: Map<string, WebSocket> = new Map();
  db: Connection;
  wss: WebSocketServer = new WebSocketServer({
    noServer: true,
    clientTracking: true,
  });
  constructor(db: Connection) {
    this.db = db;
  }
  init = () => {
    this.wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
      ws.on("message", async (data) => {
        const message = await receiveMessage(ws, this.db, data);
        if (!message) {
          return;
        }
        this.clients.get(message.receiver_id)?.send(data);
      });
      ws.on("open", async () => {
        const userData = await connectUser(ws, req, this.db);
        this.clients.set(userData?.email as string, ws);
      });
      ws.on("error", async (error) => {
        console.log("WS error");
        throw error;
      });
      ws.on("close", async () => {
        this.clients.forEach((client, email) => {
          if ((client = ws)) {
            this.clients.delete(email);
          }
          return;
        });
      });
    });

    this.wss.on("error", (error) => {
      console.log(error);
      throw error;
    });
  };
}

export { websocketProvider };
