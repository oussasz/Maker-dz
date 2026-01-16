// routes.js
import express from "express";
import dataloader from "../utils/dataloader.js";

const { wilayas, communesByWilaya } = dataloader;
const router = express.Router();

router.get("/wilayas", (req, res) => {
  res.json(wilayas);
});

router.get("/communes/:wilaya_code", (req, res) => {
  const { wilaya_code } = req.params;
  res.json(communesByWilaya[wilaya_code] || []);
});

export default router
