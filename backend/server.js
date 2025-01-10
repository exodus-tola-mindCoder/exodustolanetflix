import express from "express";
const cors = require('cors');
import cookieParser from "cookie-parser";
import path from "path";

// Allow requests from your Vercel domain
const corsOptions = {
  origin: 'https://exodustolanetfli.vercel.app/',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(cookieParser());

import authRoutes from "./routes/auth.route.js"
import movieRoutes from "./routes/movie.route.js"
import tvRoutes from "./routes/search.route.js"
import searchRoute from "./routes/search.route.js"

import protectRoute from "./middleware/protect.route.js";

import { ENV_VARS } from "./config/envVars.js";
import { connectDB } from "./config/db.js";

const app = express();

const PORT = ENV_VARS.PORT || 5000;
const __dirname = path.resolve(); // __dirname is the current directory


app.use(express.json()) // will allow us parse req.body

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/movie", protectRoute, movieRoutes);
app.use("/api/v1/tv", protectRoute, tvRoutes);
app.use("/api/v1/search", protectRoute, searchRoute);

if (ENV_VARS.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}


app.listen(PORT, () => {
  console.log("Server started at http://localhost:" + PORT);
  connectDB()
});







