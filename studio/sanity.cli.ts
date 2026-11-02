import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "9u0n5wib",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
});