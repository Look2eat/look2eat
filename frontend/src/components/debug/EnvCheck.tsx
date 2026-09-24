"use client";

import { useEffect } from "react";

/**
 * TEMPORARY — remove once the Preview/Production variable issue is solved.
 * Delete this file and its <EnvCheck /> line in src/app/layout.tsx.
 *
 * Prints, in the browser console:
 *   1. what was baked into THIS build (NEXT_PUBLIC_* values, which Next
 *      compiles in at build time), and
 *   2. what the SERVER reads at runtime, fetched from /api/debug-env.
 *
 * Silent on the `main` branch so it never runs on www.zuplin.in, even if it
 * gets merged by mistake. Keyed on the git branch, not VERCEL_ENV, because
 * "is this build really Preview?" is one of the things being checked.
 */
export function EnvCheck() {
  useEffect(() => {
    // These must stay literal `process.env.X` references — Next only inlines
    // NEXT_PUBLIC_* values it can see written out in full.
    const branch = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF;
    if (branch === "main") return;

    console.log("%c[env-check] baked into this build (browser)", "color:#2135DD;font-weight:bold", {
      vercelEnv: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "(not exposed — system env vars off?)",
      branch: branch ?? "(not exposed — system env vars off?)",
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "(NOT SET at build time)",
    });

    fetch("/api/debug-env", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((server) =>
        console.log("%c[env-check] read at runtime (server)", "color:#2135DD;font-weight:bold", server),
      )
      .catch((err) => console.warn("[env-check] could not reach /api/debug-env:", err));
  }, []);

  return null;
}
