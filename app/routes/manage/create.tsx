import { createPost } from "../../lib/directus.server";
import { getSession } from "../../lib/session.server";
import Editor from "../../components/Editor";
import { redirect, href} from "react-router";

export async function loader({ request }: { request: Request }) {
  const session = await getSession(request);
  const accessToken = session.get("access_token");

  if (!accessToken) {
    throw redirect(href("/auth/login"));
  }
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("content") as string;

  console.log("Inside of Create: ", title, description);

  if (!title || !description) {
    throw new Response("Missing fields", { status: 400 });
  }

  const session = await getSession(request);
  console.log("sessionCreate: ", session);

  if (!session) throw new Response("Unauthorized", { status: 401 });
  const accessToken = session.get("access_token");
  console.log("accessTokenCreate: ", accessToken);

  await createPost({ title, description, accessToken });

  return redirect("/?success=created");

  // return new Response(null, { status: 302, headers: { Location: "/" } });
}

export default function CreatePostPage() {
  return <Editor submitLabel="Create Post" />;
}
