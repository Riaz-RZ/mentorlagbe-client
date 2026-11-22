// Mutable API helpers (POST / PATCH / DELETE).
// For GET requests use src/lib/api.ts instead.

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

// Every backend response has the same envelope:
//   success: { success: true,  message, data }
//   error:   { success: false, message }
// This helper returns `data` on success and throws `message` on failure.
async function request(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  data?: unknown
): Promise<unknown> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
  }).catch(() => {
    throw new Error(
      "Cannot reach the API server. Make sure the backend is running on port 5000 (npm start in mentorlagbe-server)."
    );
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    const error = new Error(body?.message || "Something went wrong") as Error & {
      status?: number;
    };
    error.status = res.status;
    throw error;
  }

  return body.data;
}

// True when the backend rejected the action because of a plan
// limit (free plan: 5 bookmarks / 2 posts / 5 applications).
export function isPlanLimitError(error: unknown): boolean {
  return error instanceof Error && (error as { status?: number }).status === 403;
}

// Example: apiPost("/api/tuitions", { title: "Math", ... })
export function apiPost<T = unknown>(path: string, data: unknown): Promise<T> {
  return request(path, "POST", data) as Promise<T>;
}

// Example: apiPatch("/api/tuitions/123/status", { approvalStatus: "approved" })
export function apiPatch<T = unknown>(path: string, data: unknown): Promise<T> {
  return request(path, "PATCH", data) as Promise<T>;
}

// Example: apiDelete("/api/tuitions/123")
export function apiDelete<T = unknown>(path: string): Promise<T> {
  return request(path, "DELETE") as Promise<T>;
}
