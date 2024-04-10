require("dotenv").config();
import express, { Express } from "express";
import { AuthRoute, UserRoute, AdminRoute } from "./routes/userRoutes";
import dbConnect from "./databases/databaseConnect";
const app: Express = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());
const db = dbConnect();

const newDb = Promise.resolve(db).then((db) => {
  const userRoute = new UserRoute(db);
  const authRoute = new AuthRoute(db);
  const adminRoute = new AdminRoute(db);
  app.use("/", userRoute.registerRequest);
  app.use("/", userRoute.registerVerify);
  app.use("/", userRoute.getInformation);
  app.use("/", userRoute.updateInformation);
  app.use("/", authRoute.login);
  app.use("/", adminRoute.getAllUser);
  app.use("/", adminRoute.makeAdmin);
  app.use("/", adminRoute.deleteUser);
});

newDb;

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
