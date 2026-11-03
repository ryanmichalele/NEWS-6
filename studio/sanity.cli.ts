import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || "bl5nnct1",
    dataset: process.env.SANITY_STUDIO_DATASET || "production",
  },
  deployment: {
    appId: "el5uw4lcvtt3jpb2vfqdq6bf",
  },
});