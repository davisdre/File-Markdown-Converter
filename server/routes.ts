import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { promises as fs } from "fs";
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";

const execAsync = promisify(exec);
const upload = multer({ dest: os.tmpdir() });

export function registerRoutes(app: Express): Server {
  app.post("/api/convert", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      const { stdout, stderr } = await execAsync(
        'python3', [path.join(process.cwd(), 'server', 'convert.py'), req.file.path]
      );

      // Clean up temp file
      await fs.unlink(req.file.path);

      if (stderr) {
        console.error("Conversion error:", stderr);
        return res.status(500).send("Failed to convert file");
      }

      const result = JSON.parse(stdout);
      res.json(result);
    } catch (error) {
      console.error("Conversion error:", error);
      res.status(500).send("Failed to convert file");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}