import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { promises as fs } from "fs";
import { exec, execFile as execFileCallback } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";

const execFile = promisify(execFileCallback);
const upload = multer({ dest: os.tmpdir() });

export function registerRoutes(app: Express): Server {
  app.post("/api/convert", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      // Validate the file path
      const filePath = req.file.path;
      if (!filePath.startsWith(os.tmpdir())) {
        return res.status(400).send("Invalid file path");
      }

      const { stdout, stderr } = await execFile('python3', 
        [path.join(process.cwd(), 'server', 'convert.py'), filePath]
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