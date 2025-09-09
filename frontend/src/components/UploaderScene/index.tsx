import { Button } from "@/components/ui/Button";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import useUploadSceneUploaderHooks from "./index.hooks.tsx";
import { UploadIcon } from "lucide-react";
export default function UploaderScene() {
  const { files, handleDrop, startAnalysis, uploadStatus, analysisResult } =
    useUploadSceneUploaderHooks();
  return (
    <div className="h-[90vh] w-[50vw] py-6 flex flex-col">
      <div className="flex flex-col py-4">
        <h1 className="text-4xl!">Deep Fake Demo</h1>

        <div className="grid grid-cols-2 border text-left w-120 m-auto">
          <h2 className="text-md"> Upload Status</h2>
          <h2> {uploadStatus}</h2>
          <h2 className="text-md">Analysis Result</h2>
          <h2>
            {!analysisResult
              ? ""
              : `{ result: ${analysisResult.status},score: ${analysisResult.score}}`}
          </h2>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="w-3/4 m-auto py-3">
          <Dropzone
            className="h-60"
            onDrop={handleDrop}
            onError={console.error}
            src={files}
          >
            <DropzoneEmptyState>
              <div className="flex w-full items-center gap-4 p-8">
                <div className="p-6 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <UploadIcon />
                </div>
                <div className="text-left">
                  <p className="font-medium text-md">
                    Clicca o trascina il file da analizzare
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Supportati: mp3, jpg, png
                  </p>
                </div>
              </div>
            </DropzoneEmptyState>
            <DropzoneContent />
          </Dropzone>
        </div>
        <div>
          <Button
            className="w-100"
            variant={"destructive"}
            onClick={startAnalysis}
          >
            Analizza
          </Button>
        </div>
      </div>
    </div>
  );
}
