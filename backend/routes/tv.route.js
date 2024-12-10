import express from "express";
import { getTrendingTvs, getTvsTrailers, getTvsDetails, getSimilarTvs, getTvsByCategory } from "../Controller/Tv.controller.js";

const router = express.Router();

router.get("/trending", getTrendingTvs)
router.get("/:id/trailers", getTvsTrailers)
router.get("/:id/details", getTvsDetails)
router.get("/:id/similar", getSimilarTvs)
router.get("/:category", getTvsByCategory)

export default router;
