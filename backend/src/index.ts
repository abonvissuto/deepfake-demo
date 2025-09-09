import express from "express";
import path, { dirname } from "path";
import uploadRouter from "./routes.js";
import * as serverless from "serverless-http";
import "dotenv/config";
import { fileURLToPath } from "url";

const app = express();
// __filename equivalent
const __filename = fileURLToPath(import.meta.url);

// __dirname equivalent
const __dirname = dirname(__filename);

// Serve React build
const buildPath = path.join(
  __dirname,
  process.env.NODE_ENV == "development"
    ? "../../frontend/dist"
    : "./frontend/dist",
);
app.use(express.static(buildPath));

// API routes
app.use("/api", uploadRouter);

// React fallback (for SPA routing)
app.get("/:any", (_, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

if (process.env.NODE_ENV === "development") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
