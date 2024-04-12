import { IncomingMessage } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { Connection } from "mysql2/promise";
import { connectUser } from "./websocketUtils";

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
      const userData = await connectUser(ws, req, this.db);
      this.clients.set(userData?.email as string, ws);
      ws.on("message", (data) => {});
    });

    this.wss.on("error", (error) => {
      console.log(error);
    });
  };
}

export { websocketProvider };
