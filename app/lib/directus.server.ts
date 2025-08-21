import {
  authentication,
  createDirectus,
  readItems,
  readItem,
  rest,
  createItem,
  createUser,
  updateItem,
  logout,
  readMe,
  refresh,
  deleteItem,
} from "@directus/sdk";

import { getSession, commitSession, destroySession } from "./session.server";

// Directus client for Protected Endpoints
const directus = createDirectus("https://directus-blog-e17s.onrender.com")
  .with(rest())
  .with(authentication("json"));

// Directus client for Public Endpoints
const publicDirectus = createDirectus(
  "https://directus-blog-e17s.onrender.com"
).with(rest());

// Get All Posts, works for both Unauthenticated user and authenticated user.
export async function getAllPosts() {
  return await publicDirectus.request(readItems("posts"));
}

// Get Post by id (Helps to view post on a full page dedicated to that post)
export async function getPostbyId(id: string) {
  console.log("id: ", id);
  return await publicDirectus.request(readItem("posts", id));
}

// Create Post
export async function createPost({
  title,
  description,
  accessToken,
}: {
  title: string;
  description: string;
  accessToken: string;
}) {
  directus.setToken(accessToken);

  return await directus.request(
    createItem("posts", {
      title,
      description,
    })
  );
}

// Update Post
export async function updatePost(
  id: string,
  data: { title: string; description: string },
  accessToken: string
) {
  console.log("Inside of Update");
  console.log(id, data, accessToken);
  directus.setToken(accessToken);

  return await directus.request(
    updateItem("posts", id, {
      title: data.title,
      description: data.description,
    })
  );
}

// Get Posts for Specific User (Authenticated) / For Posts Management
export async function getMyPosts(accessToken: string) {
  directus.setToken(accessToken);

  const me = await directus.request(readMe());

  return await directus.request(
    readItems("posts", {
      filter: { userId: { _eq: me.id } },
      sort: ["-date_created"],
      fields: ["id", "title", "description", "date_created"],
    })
  );
}

// Delete Posts
export async function deletePost(id: string, accessToken: string) {
  directus.setToken(accessToken);
  return await directus.request(deleteItem("posts", id));
}

// Help user to login
export async function userLogin(email: string, password: string) {
  return await directus.login({ email, password });
}

// Get User Details
export async function getUserDetails(accessToken: string) {
  directus.setToken(accessToken);
  return await directus.request(
    readMe({ fields: ["email", "first_name", "last_name", "id"] })
  );
}

// Help user to logout
export async function userLogout(refreshToken: string) {
  console.log("Trying to logout: ", refreshToken);
  return await directus.request(
    logout({ refresh_token: refreshToken, mode: "json" })
  );
}

// User Creation / Registration
export async function userRegister(
  email: string,
  password: string,
  firstName: string,
  lastName: string
) {
  return await publicDirectus.request(
    createUser({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    })
  );
}

// Refresh Token Helper
export async function tokenRefresh(request: Request, refreshToken: string) {
  try {
    console.log("Inside of try block of tokenRefresh");
    // Call Directus refresh
    directus.setToken(refreshToken);
    const { access_token, refresh_token } = await directus.request(
      refresh({ refresh_token: refreshToken, mode: "json" })
    );

    console.log(
      "Inside of tokenRefresh, New access token: ",
      access_token,
      "New refresh Token: ",
      refresh_token
    );

    // Update session with new tokens
    const session = await getSession(request);
    session.set("access_token", access_token);
    session.set("refresh_token", refresh_token);

    return {
      access_token,
      refresh_token,
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    };
  } catch (err) {
    // If refresh fails, clear session
    const session = await getSession(request);
    session.set("access_token", null);
    session.set("refresh_token", null);

    return {
      error: err,
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    };
  }
}
