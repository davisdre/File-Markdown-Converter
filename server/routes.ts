import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { promises as fs } from "fs";
import { exec, execFile as execFileCallback } from "child_process";
import { promisify } from "util";
import path from "path";
import os from "os";
import rateLimit from "express-rate-limit";

const execFile = promisify(execFileCallback);
const upload = multer({ dest: os.tmpdir() });
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

export function registerRoutes(app: Express): Server {
  app.post("/api/convert", limiter, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      // Validate the file path
      const filePath = path.join(os.tmpdir(), path.basename(req.file.path));
      const realFilePath = await fs.realpath(filePath);
      if (!realFilePath.startsWith(os.tmpdir() + path.sep)) {
        return res.status(400).send("Invalid file path");
      }

      const { stdout, stderr } = await execFile('python3', 
        [path.join(process.cwd(), 'server', 'convert.py'), filePath]
      );

      // Clean up temp file
      const unlinkFilePath = path.join(os.tmpdir(), path.basename(req.file.path));
      const realUnlinkFilePath = await fs.realpath(unlinkFilePath);
      if (!realUnlinkFilePath.startsWith(os.tmpdir() + path.sep)) {
        return res.status(400).send("Invalid file path");
      }
      await fs.unlink(realUnlinkFilePath);

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