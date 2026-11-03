import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || "bl5nnct1";
const dataset = process.env.SANITY_STUDIO_DATASET || "production";

export default defineConfig({
  name: "default",
  title: "CWN Bank News",
  projectId,
  dataset,
  basePath: "/",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Story Settings")
              .id("storySettings")
              .child(
                S.document()
                  .schemaType("storySettings")
                  .documentId("storySettings")
              ),
            S.divider(),
            S.document()
              .schemaType("article")
              .documentId("article")
              .title("Article"),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});