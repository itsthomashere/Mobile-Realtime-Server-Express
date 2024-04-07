require("dotenv").config();
import express, { Express, Request, Response } from "express";
import { UserRoute } from "./routes/userRoutes";
import dbConnect from "./databases/databaseConnect";
import { mainSender } from "./utils/mailingServices";
const app: Express = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
const db = dbConnect();

const newDb = Promise.resolve(db).then((db) => {
  const userRoute = new UserRoute(db);

  app.use("/", userRoute.getAllUser);
  app.use("/", userRoute.createUser);
});

newDb;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
