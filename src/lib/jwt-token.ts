import { authClient } from "@/lib/auth-client";

const TOKEN_EXPIRY_BUFFER_MS = 30_000;

let cachedToken: { value: string; expiresAt: number } | null = null;
let tokenRequest: Promise<string | null> | null = null;
let authStateVersion = 0;

function getTokenExpiration(token: string): number {
    const payload = token.split(".")[1];

    if (!payload) {
        throw new Error("The auth server returned an invalid JWT.");
    }

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(
        Math.ceil(base64.length / 4) * 4,
        "="
    );

    let claims: unknown;
    try {
        claims = JSON.parse(atob(paddedBase64));
    } catch {
        throw new Error("The auth server returned an invalid JWT.");
    }

    if (
        typeof claims !== "object" ||
        claims === null ||
        !("exp" in claims) ||
        typeof claims.exp !== "number"
    ) {
        throw new Error("The auth server returned a JWT without an expiry.");
    }

    return claims.exp * 1000;
}

async function requestJwtToken(version: number): Promise<string | null> {
    const { data, error } = await authClient.$fetch<{ token: string }>(
        "/token",
        { method: "GET" }
    );

    if (error) {
        if (error.status === 401) {
            return null;
        }

        throw new Error(error.message || "Failed to retrieve an API token.");
    }

    if (!data?.token) {
        throw new Error("The auth server did not return an API token.");
    }

    const expiresAt = getTokenExpiration(data.token);
    if (expiresAt <= Date.now()) {
        throw new Error("The auth server returned an expired API token.");
    }

    if (version !== authStateVersion) {
        return null;
    }

    if (expiresAt > Date.now() + TOKEN_EXPIRY_BUFFER_MS) {
        cachedToken = { value: data.token, expiresAt };
    }

    return data.token;
}

export async function getJwtToken(): Promise<string | null> {
    if (typeof window === "undefined") {
        return null;
    }

    if (
        cachedToken &&
        cachedToken.expiresAt > Date.now() + TOKEN_EXPIRY_BUFFER_MS
    ) {
        return cachedToken.value;
    }

    const request = tokenRequest ?? requestJwtToken(authStateVersion);
    tokenRequest = request;

    try {
        return await request;
    } finally {
        if (tokenRequest === request) {
            tokenRequest = null;
        }
    }
}

export function clearJwtToken(): void {
    authStateVersion += 1;
    cachedToken = null;
    tokenRequest = null;
}
