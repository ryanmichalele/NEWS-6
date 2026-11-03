const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const CORS_HEADERS: Record<string, string> = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

function json(status: number, payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: CORS_HEADERS,
  });
}

const TURNSTILE_SECRET_KEY = import.meta.env.VITE_TURNSTILE_SECRET_KEY || "";

async function verifyTurnstile(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) return true;
  const res = await fetch(`https://challenges.cloudflare.com/v0/siteverify`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });
  const data = await res.json();
  return data.success === true;
}

export default async (request: Request, context: { ip?: string }): Promise<Response> => {
  if (request.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  let email = "";
  try {
    const parsed = await request.json();
    email = typeof parsed?.email === "string" ? parsed.email.trim() : "";
  } catch {
    return json(400, { error: "invalid_json" });
  }

  const turnstileToken = typeof parsed?.["cf-turnstile-response"] === "string" ? parsed["cf-turnstile-response"] : "";

  if (!(await verifyTurnstile(turnstileToken))) {
    return json(400, { error: "turnstile_verification_failed" });
  }

  if (!EMAIL_RE.test(email)) {
    return json(400, { error: "invalid_email" });
  }

  // Persistence (email list, CRM, DB) would go here.
  // For now just acknowledge.
  console.log("subscription", { email });

  return json(200, { ok: true });
};