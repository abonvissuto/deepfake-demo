import { useState } from "react";

export default function useUploadSceneUploaderHooks() {
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };
  const startAnalysis = () => {
    console.log(files ? files[0].name : "No files uploaded");
  };
  return {
    files,
    handleDrop,
    startAnalysis,
  };
}
