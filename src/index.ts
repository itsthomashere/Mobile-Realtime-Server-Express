require("dotenv").config();
import dbConnect from "./databases/databaseConnect";
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;

dbConnect();

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
