const express = require("express");
const authRouter = require("./router/authRouter");
const app = express();
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 3003;
const dotenv = require('dotenv');
const cookieParser = require("cookie-parser");
dotenv.config();
const mongoose = require('mongoose');

mongoose.connect(process.env.db_url,
()=>{
  console.log("connect Mongo..");
})

app.use(express.json());
app.use("/api/user",authRouter);
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cookieParser);
app.listen(PORT, () => console.log(`Server in Running Post [${PORT}]`));
