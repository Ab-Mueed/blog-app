import { useState } from "react";
import { redirect, href, Form } from "react-router";

import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { getSession, commitSession } from "../../lib/session.server";
import { userLogin } from "../../lib/directus.server";

export async function loader({ request }: { request: Request }) {
  const session = await getSession(request);
  if (session.get("access_token")) {
    throw redirect(href("/"));
  }
  return null;
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const { access_token, refresh_token } = await userLogin(email, password);

    const session = await getSession(request);
    session.set("access_token", access_token);
    session.set("refresh_token", refresh_token);

    return redirect(href("/"), {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return { error: "Invalid email or password" };
  }
}

export default function LoginPage({ actionData }: any) {
  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value.length >= 6 ? null : "Password too short"),
    },
  });
  return (
    <Container size={420} my={40}>
      <Title ta="center" mb="md">Welcome Back</Title>
      <Paper>
        {actionData?.error && (
          <Alert color="red" mb="md">
            {actionData.error}
          </Alert>
        )}

        <Form method="post">
          <Stack>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              {...form.getInputProps("email")}
              name="email"
            />
            <PasswordInput
              label="Password"
              placeholder="Your Password"
              {...form.getInputProps("password")}
              name="password"
            />
            <Button type="submit" mt="xl">
              Login
            </Button>
          </Stack>
        </Form>
      </Paper>
    </Container>
  );
}
