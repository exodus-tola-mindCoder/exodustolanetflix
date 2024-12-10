import jwt from "jsonwebtoken";
import User from "../modals/user.model.js";
import { ENV_VARS } from "../config/envVars.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies["jwt-netflix"]

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized - no token provided" })
    }

    const decoded = jwt.verify(token, ENV_VARS.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized - invalid token" })
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "user not found" })
    }
    req.user = user;

    next();


  } catch (error) {
    console.log("Error in the protection middleware:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });

  }
}
export default protectRoute