import { getPostbyId } from "../../lib/directus.server";
import { Container, Title, Text } from "@mantine/core";

export async function loader({ params }: any) {
  const { id } = params;
  if (!id) {
    throw new Response("Post ID is required", { status: 400 });
  }
  try {
    const post = await getPostbyId(id);
    console.log("post: ", post);
    return { post };
  } catch (error) {
     const post = await getPostbyId(id);
     console.log("post: ", post);
    throw new Response("Page not found", { status: 404 });
  }
}

export default function PostPage({ loaderData }: any) {
  return (
    <Container fluid py="lg">
      <Title order={1} mb="md" c="orange.3">
        {loaderData.post.title}
      </Title>
      <Text size="sm" c="dimmed" mb="xl">{new Date(loaderData.post.date_created).toLocaleDateString()}</Text>
      {/* <Text size="md" style={{ whitespace: "pre-line" }} ta="justify">
        {loaderData.post.description}
      </Text> */}
      <div
        style={{ textAlign: "justify" }}
        dangerouslySetInnerHTML={{ __html: loaderData.post.description }}
      />
    </Container>
  );
}
