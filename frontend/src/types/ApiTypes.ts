import * as z from "zod";

// const example = {
//   "requestId": "b5bb974e-b938-4081-b18f-91d51f404445",
//   "status": "MANIPULATED",
//   "score": 0.89,
//   "models": [
//     { "name": "rd-oak-img", "status": "AUTHENTIC", "score": 0.01 },
//     { "name": "rd-context-img", "status": "MANIPULATED", "score": 0.93 },
//     {
//       "name": "rd-img-ensemble",
//       "status": "MANIPULATED",
//       "score": 0.8447394916064743
//     },
//     {
//       "name": "rd-elm-img",
//       "status": "MANIPULATED",
//       "score": 0.5488096475601196
//     },
//     { "name": "rd-cedar-img", "status": "AUTHENTIC", "score": 0.01 },
//     { "name": "rd-pine-img", "status": "MANIPULATED", "score": 0.99 }
//   ]
// }

// export type ModelResultType = {
//   name: string;
//   score: number;
//   status: string;
// };
// export type AnalysisResultType = {
//   requestId: string;
//   status: string;
//   score: number;
//   models: ModelResultType[];
// };

export const AnalysisResultTypeSchema = z.object({
  requestId: z.string(),
  status: z.string(),
  score: z.number(),
  models: z
    .array(
      z.object({
        name: z.string(),
        score: z.number(),
        status: z.string(),
      }),
    )
    .optional(),
});
