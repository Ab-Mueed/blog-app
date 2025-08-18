import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Alert,
  Anchor,
  Text,
  Group,
} from "@mantine/core";
import {
  hasLength,
  isEmail,
  isNotEmpty,
  matchesField,
  useForm,
} from "@mantine/form";
import { getSession } from "../../lib/session.server";
import { userRegister } from "../../lib/directus.server";
import { redirect, href, Link, Form } from "react-router";

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
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;

  // console.log(email, password, firstName, lastName); // Debug Log

  try {
    await userRegister(email, password, firstName, lastName);
    return redirect(href("/auth/login"));
  } catch (error: any) {
    if (error?.errors?.[0].extensions.code === "RECORD_NOT_UNIQUE") {
      return { error: "An account with this email already exists" };
    }

    return { error: "Registration Failed. Please try again" };
  }
}

export default function RegisterPage({ actionData }: any) {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
    validateInputOnBlur: true,
    validate: {
      email: isEmail("Invalid Email"),
      password: hasLength({ min: 5 }, "Password must be at least 5 characters"),
      confirmPassword: matchesField("password", "Passwords do not match"),
      firstName: isNotEmpty("First Name is required"),
      lastName: isNotEmpty("Last name is required"),
    },
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center" mb="md">
        Create Account
      </Title>
      <Paper>
        {actionData?.error && (
          <Alert color="red" mb="md">
            {actionData.error}
          </Alert>
        )}
        <Form
          method="post"
          onSubmit={(e) => {
            const isValid = form.validate();
            if (isValid.hasErrors) {
              e.preventDefault(); // stop RR submission if invalid
            }
          }}
        >
          <Stack>
            <Group grow>
              <TextInput
                label="First Name"
                placeholder="John"
                key={form.key("firstName")}
                {...form.getInputProps("firstName")}
                name="firstName"
                required
              />
              <TextInput
                label="Last Name"
                placeholder="Doe"
                key={form.key("lastName")}
                {...form.getInputProps("lastName")}
                name="lastName"
                required
              />
            </Group>
            <TextInput
              label="Email"
              placeholder="you@blogpulse.com"
              key={form.key("email")}
              {...form.getInputProps("email")}
              name="email"
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your Password"
              key={form.key("password")}
              {...form.getInputProps("password")}
              name="password"
              required
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm Your Password"
              key={form.key("confirmPassword")}
              {...form.getInputProps("confirmPassword")}
              name="confirmPassword"
              required
            />
            <Button type="submit" mt="xl">
              Register
            </Button>
          </Stack>
        </Form>

        <Text c="dimmed" size="sm" ta="center" mt="md">
          Already have an account?{" "}
          <Anchor component={Link} to="/auth/login" size="sm">
            Login
          </Anchor>
        </Text>
      </Paper>
    </Container>
  );
}
