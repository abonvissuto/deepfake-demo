import { Router } from "express";
import multer from "multer";
import { UUIDTypes, v4 as uuidv4 } from "uuid";
const router = Router();

import crypto from "crypto";
import path from "path";

import { realityDefender } from "./lib/realityDefender";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    // Generate random string
    const randomName = crypto.randomBytes(16).toString("hex");
    // Preserve extension
    const ext = path.extname(file.originalname);
    cb(null, randomName + ext);
  },
});
const upload = multer({
  dest: "uploads/",
  storage,
});
const jobs: Record<string, JobStatus> = {};

type JOB_STATUS_ENUM = "READY" | "RUNNING" | "DONE" | "ERROR";
type AnalysisResult = {
  status: "MANIPULATED" | "AUTHENTIC" | string;
  score: number | null;
};
type JobStatus = {
  path: string;
  status: JOB_STATUS_ENUM;
  result?: AnalysisResult;
  clients: any;
  finished: boolean;
};
type ClientJobStatus = {
  status: JOB_STATUS_ENUM;
  result?: AnalysisResult;
};

// STEP 1: Client uploads file
router.post("/upload", upload.single("file"), async (req, res) => {
  const clientJobId = uuidv4();
  req.file?.path;
  // Save initial job state
  jobs[clientJobId] = {
    path: req.file?.path ?? "",
    status: "READY",
    result: undefined,
    clients: [],
    finished: false,
  };

  // Kick off async "processing"
  await performAnalysis(clientJobId);

  res.json({ jobId: clientJobId });
});

// STEP 2: Client subscribes to updates
router.get("/events/:jobId", async (req, res) => {
  const { jobId } = req.params;

  if (!jobs[jobId]) res.end();

  // Standard SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Push response into the "subscribers" list

  jobs[jobId].clients.push(res);
  const clientJobStatus = serverToClientStatus(jobs[jobId]);
  // Send the current state right away
  res.write(`data: ${JSON.stringify({ ...clientJobStatus })}\n\n`);
});

function serverToClientStatus(job: JobStatus): ClientJobStatus {
  return {
    status: job.status,
    result: job.result,
  };
}
// --- Simulated async job ---
async function performAnalysis(jobId: string) {
  try {
    const { requestId } = await realityDefender.upload({
      filePath: jobs[jobId].path,
    });
    console.log(`Request forwarded with id > ${requestId}`);

    jobs[jobId].status = "RUNNING";
    signal(jobId);

    //Await results using the requestId
    const result = await realityDefender.getResult(requestId);
    console.log(`Got result from API > ${JSON.stringify(result)}`);

    jobs[jobId].status = "DONE";
    jobs[jobId].result = {
      status: result.status,
      score: result.score,
    };
    signal(jobId);
  } catch (e) {
    console.log(e);
    jobs[jobId].status = "ERROR";
    signal(jobId);
  }
}

// Send update to all SSE clients
function signal(jobId: string, close = false) {
  const job = jobs[jobId];
  if (job.finished) return;

  const data = serverToClientStatus(job);
  job.clients.forEach((res: any) => {
    res.write(`data: ${JSON.stringify({ ...data })}\n\n`);
    if (close) res.end();
  });
  if (close) {
    job.clients = [];
    job.finished = true;
  }
}

router.get("/hello", (req, res) => {
  res.json({
    message: "ALL GOOD",
  });
});

export default router;
