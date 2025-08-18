import { redirect, href } from "react-router";
import { destroySession, getSession } from "../../lib/session.server";
import { userLogout } from "../../lib/directus.server";

export async function action({ request }: { request: Request }) {
  const session = await getSession(request);
  console.log("Session: ", session);

  const refreshToken = session.get("refresh_token");
  console.log("refreshToken: ", refreshToken )
  if (refreshToken) {
    await userLogout(refreshToken);
  }

  return redirect(href("/"), {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export default function LogoutPage() {
  return null;
}
