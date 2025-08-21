import {
  Container,
  Text,
  Card,
  Title,
  SimpleGrid,
  Group,
  Anchor,
} from "@mantine/core";
import type { Route } from "./+types/_index";

import { getAllPosts } from "~/lib/directus.server";
import { Link, href } from "react-router";

export async function loader() {
  const allPosts = await getAllPosts();
  return { allPosts };
}

export default function HomePage({ loaderData }: Route.ComponentProps) {

  function stripHtml(html: string) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || ""
  }
  return (
    <Container fluid>
      <Title order={2} mb="lg">
        Latest Posts
      </Title>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {loaderData.allPosts.map((post: any) => (
          <Card key={post.id} withBorder>
            <Group>
              <Text fw={500}>{post.title}</Text>
            </Group>

            <Text size="sm" c="dimmed" mb="md" lineClamp={1}>
              {stripHtml(post.description)}
            </Text>

            <Anchor
              variant="light"
              w={120}
              component={Link}
              to={href("/posts/:id", { id: post.id.toString() })}
            >
              Read More
            </Anchor>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
