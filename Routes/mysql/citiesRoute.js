import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get cities data
router.get("/cities", (req, res) => {
  try {
    const citiesPath = path.join(__dirname, "../../utils/algeria_cities.json");
    const citiesData = fs.readFileSync(citiesPath, "utf8");
    const cities = JSON.parse(citiesData);
    res.json(cities);
  } catch (error) {
    console.error("Error loading cities:", error);
    res.status(500).json({ error: "Failed to load cities data" });
  }
});

export default router;
