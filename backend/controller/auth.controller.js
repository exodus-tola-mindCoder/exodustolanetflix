import User from "../modals/user.model.js"
import bcryptjs from "bcryptjs"
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all fields' });
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }
    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return res.status(400).json({ success: false, message: "Email already Exist" });
    }
    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
      return res.status(400).json({ success: false, message: "Username already Exist" });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt)

    const PROFILE_PICS = ["/default.png", "/default2.png", "/default3.png"];

    const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]

    //hash the password

    const newUser = new User({
      username,
      password: hashPassword,
      email,
      image
    })
    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      // remove the password from the response
      res.status(201).json({
        success: true, User: {
          ...newUser._doc,
          password: ""
        },
      });
    }

  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: "ALl field must be required" })
    }

    const user = await User.findOne({ email: email })
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credential" });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      res.status(400).json({ success: false, message: "Invalid Credentials" })
    }
    generateTokenAndSetCookie(user._id, res)
    res.status(200).json({
      success: true, user: {
        ...user._doc,
        password: ""
      }
    })
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(400).json({ success: false, message: "Internal Server Error" })

  }
}
export async function logout(req, res) {
  try {
    res.clearCookie("jwt-netflix");
    res.status(200).json({ success: true, message: "Logged out successfully" });

  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(400).json({ success: false, message: "Internal Server Error" });
  }
}

export async function authCheck(req, res) {
  try {
    
    res.status(200).json({ success: true, user: req.user })

  } catch (error) {
    console.log("Error in authCheck controller", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}