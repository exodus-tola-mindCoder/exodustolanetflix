import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" }); // creates token
  res.cookie("jwt-netflix", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // in 15 days milisecond
    httpOnly: true, // prevent csrf attacks cross-site scripting attacks, make it not accessed by js
    sameSite: "strict",
    secure: ENV_VARS.NODE_ENV !== "development"
  });
  return token;
}

