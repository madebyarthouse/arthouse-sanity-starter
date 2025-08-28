import { createCookieSessionStorage } from "react-router";
import type { loadQuery } from "~/sanity/loader.server";
import crypto from "node:crypto";

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      httpOnly: true,
      name: "__sanity_preview", 
      path: "/",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      secrets: [crypto.randomBytes(16).toString("hex")],
      secure: process.env.NODE_ENV !== "development",
    },
  });

async function previewContext(
  headers: Headers
): Promise<{ preview: boolean; options: Parameters<typeof loadQuery>[2] }> {
  const previewSession = await getSession(headers.get("Cookie"));

  const preview =
    previewSession.get("projectId") === process.env.PUBLIC_SANITY_PROJECT_ID;

  return {
    preview,
    options: preview
      ? {
          perspective: "previewDrafts",
          stega: true,
        }
      : {
          perspective: "published",
          stega: false,
        },
  };
}

export { commitSession, destroySession, getSession, previewContext };
