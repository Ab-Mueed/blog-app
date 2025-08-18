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
} from "@directus/sdk";

const directus = createDirectus("https://directus-blog-e17s.onrender.com")
  .with(rest())
  .with(authentication("json"));

// Get All Posts, works for both Unauthenticated user and authenticated user.
export async function getAllPosts() {
  return await directus.request(readItems("posts"));
}

// Get Post by id (Helps to view post on a full page dedicated to that post)
export async function getPostbyId(id: string) {
  console.log("id: ", id);
  return await directus.request(readItem("posts", id));
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

// Help user to login
export async function userLogin(email: string, password: string) {
  return await directus.login({ email, password });
}

// Get User Details
export async function getUserDetails(accessToken: string) {
  directus.setToken(accessToken);
  return await directus.request(
    readMe({ fields: ["email", "first_name", "last_name"] })
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
  return await directus.request(
    createUser({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    })
  );
}
