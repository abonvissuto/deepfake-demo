import "dotenv/config"
import { RealityDefender } from "@realitydefender/realitydefender";

export const realityDefender = new RealityDefender({
  apiKey: process.env.REALITY_DEFENDER_API_KEY as string,
});
