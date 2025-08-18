import {
  AppShell,
  Group,
  Stack,
  Text,
  Container,
  Anchor,
  Burger,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet, Form } from "react-router";
import { getUserToken } from "../lib/session.server";

export async function loader({ request }: { request: Request }) {
  const token = await getUserToken(request);
  return { isAuthenticated: Boolean(token) };
}

export default function Layout({
  loaderData,
}: {
  loaderData: { isAuthenticated: boolean };
}) {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: true },
      }}
      header={{ height: 70 }}
      transitionDuration={700}
      transitionTimingFunction="ease"
    >
      <AppShell.Header p="md">
        <Container fluid>
          <Group justify="space-between">
            <Text fw={700} size="lg">
              Blog Pulse
            </Text>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="md"
            />

            <Group gap="xl" visibleFrom="sm">
              <Anchor component={Link} to="/">
                Home
              </Anchor>
              {loaderData.isAuthenticated && (
                <Anchor component={Link} to="/manage">
                  Manage
                </Anchor>
              )}
              {!loaderData.isAuthenticated && (
                <Anchor component={Link} to="/auth/login">
                  Login
                </Anchor>
              )}
              {!loaderData.isAuthenticated && (
                <Anchor component={Link} to="/auth/register">
                  Register
                </Anchor>
              )}
              {loaderData.isAuthenticated && (
                <Form action="/auth/logout" method="post">
                  <Anchor component="button" type="submit">
                    Logout
                  </Anchor>
                </Form>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar hiddenFrom="sm" p="xl">
        <Stack gap="lg">
          <Anchor component={Link} to="/">
            Home
          </Anchor>
          {loaderData.isAuthenticated && (
            <Anchor component={Link} to="/manage">
              Manage
            </Anchor>
          )}
          {!loaderData.isAuthenticated && (
            <Anchor component={Link} to="/auth/login">
              Login
            </Anchor>
          )}
          {!loaderData.isAuthenticated && (
            <Anchor component={Link} to="/auth/register">
              Register
            </Anchor>
          )}
          {loaderData.isAuthenticated && (
            <Form action="/auth/logout" method="post">
              <Anchor component="button" type="submit">
                Logout
              </Anchor>
            </Form>
          )}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
