// file: src/app.ts
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import path from "path";

import fs from "fs";

import { Year } from "./types";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "..", "assets")));

// Utility to read all media files and return the nested structure
const getMediaStructure = (): Year[] => {
  const root = path.join(__dirname, "..", "assets");

  const years: Record<number, Year> = {};

  const walk = (dir: string) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        const relPath = path.relative(root, fullPath);
        const parts = relPath.split(path.sep);

        if (parts.length < 4) continue; // Skip invalid structure

        const [yearStr, monthStr, dayStr, ...fileParts] = parts;
        const filename = fileParts.join("/");

        const year = parseInt(yearStr, 10);
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);

        if (!years[year]) years[year] = { year, months: [] };

        const yearObj = years[year];

        let monthObj = yearObj.months.find((m) => m.month === month);
        if (!monthObj) {
          monthObj = { month, days: [] };
          yearObj.months.push(monthObj);
        }

        let dayObj = monthObj.days.find((d) => d.day === day);
        if (!dayObj) {
          dayObj = { day, assets: [] };
          monthObj.days.push(dayObj);
        }

        dayObj.assets.push(`${year}/${month}/${day}/${filename}`);
      }
    }
  };

  walk(root);

  // Sort by year, month, day if needed
  return Object.values(years).sort((a, b) => b.year - a.year);
};

app.get("/api", async (_req: Request, res: Response) => {
  try {
    res.status(200).json({
      message: "Welcome",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred!" });
  }
});

app.get("/api/assets", (_req: Request, res: Response) => {
  try {
    const media = getMediaStructure();
    res.status(200).json(media);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load assets" });
  }
});

export default app;
