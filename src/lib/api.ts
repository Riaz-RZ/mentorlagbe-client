// GET-only API helpers (read operations).
// For POST / PATCH / DELETE use src/lib/actions.ts instead.
import { getJwtToken } from "@/lib/jwt-token";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://mentorlagbe-server-bay.vercel.app";

// Every backend response has the same envelope:
//   success: { success: true,  message, data }
//   error:   { success: false, message }
// This helper returns `data` on success and throws `message` on failure.
async function request(path: string): Promise<unknown> {
  const token = await getJwtToken();
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    headers,
  }).catch(() => {
    throw new Error(
      "Cannot reach the API server. Make sure the backend is running on port 5000 (npm start in mentorlagbe-server)."
    );
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    throw new Error(body?.message || "Something went wrong");
  }

  return body.data;
}

// Example: apiGet("/api/tuitions/mine?tutorEmail=a@b.com")
export function apiGet<T = unknown>(path: string): Promise<T> {
  return request(path) as Promise<T>;
}
