import { useState } from "react";
import axios from "axios";
import * as z from "zod";
import { AnalysisResultTypeSchema } from "@/types/ApiTypes";

export default function useUploadSceneUploaderHooks() {
  const [files, setFiles] = useState<File[] | undefined>();
  const [uploadStatus, setUploadStatus] = useState<string>("NONE");
  const [analysisResult, setAnalysisResult] = useState<
    { score: number; status: string } | undefined
  >(undefined);
  const handleDrop = (files: File[]) => {
    // console.log(files);
    setFiles(files);
  };

  const startAnalysis = async () => {
    if (files?.length == 0 || !files?.at(0)) {
      return;
    }
    const form = new FormData();
    form.append("file", files[0]);
    const res = await axios.post("/api/upload", form);

    // STEP 2: Subscribe to updates via SSE
    const eventSource = new EventSource(`/api/events/${res.data.jobId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      let result;
      try {
        result = z.safeParse(AnalysisResultTypeSchema, data);
        result = result.data;
        setUploadStatus(result?.status ?? "");
        if (data.status === "DONE" || data.status === "ABORTED") {
          console.log(data);
          setAnalysisResult(data.result);
          setUploadStatus(data.status);
          eventSource.close(); // STEP 6: close connection
        }
      } catch {
        eventSource.close();
      }
    };
  };

  return {
    files,
    handleDrop,
    startAnalysis,
    analysisResult,
    uploadStatus,
  };
}
