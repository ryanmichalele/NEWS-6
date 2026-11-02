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

// Turnstile verification removed — form now submits directly
export default async (request: Request, context: { ip?: string }): Promise<Response> => {
  if (request.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  let email = "";
  let name = "";
  try {
    const parsed = await request.json();
    email = typeof parsed?.email === "string" ? parsed.email.trim() : "";
    name = typeof parsed?.name === "string" ? parsed.name.trim() : "";
  } catch {
    return json(400, { error: "invalid_json" });
  }

  if (!EMAIL_RE.test(email)) {
    return json(400, { error: "invalid_email" });
  }

  // Persistence (email list, CRM, DB) would go here.
  // For now just acknowledge.
  console.log("subscription", { email, name });

  return json(200, { ok: true });
};