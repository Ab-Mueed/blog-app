import { createCookieSessionStorage } from "react-router";

const sessionSecret = process.env.SESSION_SECRET || "super-secret";

if (!sessionSecret) {
  throw new Error("SESSION_SECRET is required");
}

export const storage = createCookieSessionStorage({
  cookie: {
    name: "blog_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

export async function getSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function commitSession(session: any) {
  return storage.commitSession(session);
}

export async function destroySession(session: any) {
  return storage.destroySession(session);
}

export async function getUserToken(request: Request) {
  const session = await getSession(request);
  return session.get("access_token") || null;
}
