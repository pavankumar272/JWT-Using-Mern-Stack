const express = require("express");
const authRouter = express.Router();
const User = require("../models/User");
const { hashGenerate } = require("../helpers/hashing");
const { hashValidator } = require("../helpers/hashing");
const {tokenGenertor} = require("../helpers/token");
const authVerify = require("../helpers/authVerify");
authRouter.post("/signup", async (req, res) => {
  try {
    const hashPassword = await hashGenerate(req.body.UserPass);
    const user = new User({
      username: req.body.UserName,
      email: req.body.UserEmail,
      password: hashPassword,
    });
    const saveUser = await user.save();
    res.send(saveUser);
  } catch (error) {
    res.send(error);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (!existingUser) {
      res.send("No user found!!");
    } else {
      const checkUser = await hashValidator(
        req.body.password,
        existingUser.password
      );
      if (!checkUser) {
        res.send("password is incorrect");
      } else {
        const token = await tokenGenertor(existingUser.email);
       res.cookie("jwt",token);
        res.send(token);
      }
    }
  } catch (error) {
    res.send(error);
  }
});
authRouter.get("/protected", authVerify,(req,res)=>{
  res.send("Protected");
})
module.exports = authRouter;
