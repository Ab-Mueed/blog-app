import { getSession } from "../../lib/session.server";
import {
  getPostbyId,
  updatePost,
  getUserDetails,
} from "../../lib/directus.server";
import Editor from "../../components/Editor";
import { redirect, href } from "react-router";

export async function loader({
  params,
  request,
}: {
  params: any;
  request: Request;
}) {
  const session = await getSession(request);
  const accessToken = session.get("access_token");

  if (!accessToken) {
    throw redirect(href("/auth/login"));
  }

  const { id } = params;

  if (!id) {
    throw new Response("Post Not Found", { status: 400 });
  }

  try {
    const userDetail = await getUserDetails(accessToken);
    const post = await getPostbyId(id);

    if (post.userId !== userDetail.id) {
      throw new Response("Forbidden", { status: 403 });
    }

    // if(post.userId)

    // console.log("post: ", post);
    return { post };
  } catch (error) {
    const post = await getPostbyId(id);
    console.log("post: ", post);
    throw new Response("Page not found", { status: 404 });
  }
}

export async function action({
  request,
  params,
}: {
  request: Request;
  params: any;
}) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("content") as string;

  if (!title || !description) {
    throw new Response("Missing Fields", { status: 400 });
  }

  const session = await getSession(request);
  if (!session) throw new Response("Unauthorized", { status: 401 });
  const accessToken = session.get("access_token");

  await updatePost(params.id, { title, description }, accessToken);

  return redirect(href("/"))
  // return new Response(null, { status: 302, headers: { Location: "/" } });
}

export default function EditPostPage({ loaderData }: any) {
  return (
    <Editor
      initialData={{
        title: loaderData.post.title,
        content: loaderData.post.description,
      }}
      submitLabel="Update Post"
    />
  );
}
