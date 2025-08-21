import {
  Container,
  Title,
  Card,
  Group,
  Text,
  Anchor,
  Button,
  SimpleGrid,
} from "@mantine/core";
import { Form, Link, href, redirect } from "react-router";
import { getSession } from "../../lib/session.server";
import { deletePost, getMyPosts } from "../../lib/directus.server";

export async function loader({ request }: { request: Request }) {
  const session = await getSession(request);
  const accessToken = session.get("access_token");

  if (!accessToken) {
    throw redirect(href("/auth/login"));
  }

  const posts = await getMyPosts(accessToken);
  return { posts };
}

export async function action({ request }: { request: Request }) {
  const session = await getSession(request);
  const accessToken = session.get("access_token");

  if (!accessToken) {
    return redirect("/auth/login");
  }
  const formData = await request.formData();
  const postId = formData.get("postId") as string;

  try {
    await deletePost(postId, accessToken);
    return redirect("/manage");
  } catch (err) {
    return new Response(null, { status: 500 });
  }
}

export default function ManagePost({ loaderData }: any) {
  return (
    <Container fluid>
      <Group justify="space-between" mb="lg">
        <Title order={2}>Your Posts</Title>
        <Anchor component={Link} to={href("/manage/create")}>
          + New Post
        </Anchor>
      </Group>

      {loaderData.posts.length === 0 ? (
        <Text c="dimmed">No Posts yet - Create your first one!</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
          {loaderData.posts.map((post: any) => (
            <Card key={post.id} withBorder>
              <Group justify="space-between" mb="xs">
                <Text fw={600}>{post.title}</Text>
                <Text size="xs" c="dimmed">
                  {post.date_created
                    ? new Date(post.date_created).toLocaleDateString()
                    : ""}
                </Text>
              </Group>

              <Text size="sm" c="dimmed" lineClamp={2} mb="md">
                {post.description}
              </Text>

              <Group gap="md">
                <Anchor
                  component={Link}
                  to={href("/manage/edit/:id", { id: post.id.toString() })}
                >
                  Edit
                </Anchor>

                <Anchor
                  component={Link}
                  to={href("/posts/:id", { id: post.id.toString() })}
                >
                  View
                </Anchor>
                <Form method="post">
                  <input type="hidden" name="postId" value={post.id} />
                  <Button type="submit" color="red" size="xs" variant="light">
                    Delete
                  </Button>
                </Form>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}
