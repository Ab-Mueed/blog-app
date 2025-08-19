import {
  AppShell,
  Group,
  Stack,
  Text,
  Container,
  Anchor,
  Burger,
  Tooltip,
  Avatar,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, Outlet, Form } from "react-router";
import { getUserToken } from "../lib/session.server";
import { getUserDetails } from "~/lib/directus.server";

export async function loader({ request }: { request: Request }) {
  const token = await getUserToken(request);

  if (!token) {
    return { isAuthenticated: false, user: null };
  } else {
    const user = await getUserDetails(token);
    return {
      isAuthenticated: true,
      user: {
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    };
  }
}

export default function Layout({
  loaderData,
}: {
  loaderData: { isAuthenticated: boolean; user: any };
}) {
  const [opened, { toggle }] = useDisclosure();
  const userInitials =
    loaderData.user?.firstName?.[0]?.toUpperCase() +
      loaderData.user?.lastName?.[0]?.toUpperCase() || "";

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
              {loaderData.user ? (
                <Tooltip
                  label={`${loaderData.user.firstName} ${loaderData.user.lastName} [
                  ${loaderData.user.email}]`}
                  withArrow
                >
                  <Avatar radius="xl" color="teal">
                    {userInitials}
                  </Avatar>
                </Tooltip>
              ) : null}
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
          {loaderData.user ? (
            <Box bg="gray"  p="4px 12px" style={{borderRadius:"4px", width:"fit-content"}}>
              <Text c="teal" >
                {loaderData.user.firstName} {loaderData.user.lastName} [
                {loaderData.user.email}]
              </Text>
            </Box>
          ) : null}
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
