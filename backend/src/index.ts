import express from "express";
import path from "path";
import uploadRouter from "./routes";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 3000;

// Serve React build
const buildPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(buildPath));

// API routes
app.use("/api", uploadRouter);

// React fallback (for SPA routing)
app.get("/:any", (_, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
