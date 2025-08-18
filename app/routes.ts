import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("", "routes/_layout.tsx", [
    index("routes/_index.tsx"),
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/logout", "routes/auth/logout.tsx"),
    route("auth/register", "routes/auth/register.tsx"),
    route("posts/:id", "routes/posts/$id.tsx"),
    route("manage", "routes/manage/_index.tsx"),
    route("manage/create", "routes/manage/create.tsx"),
    route("manage/edit/:id", "routes/manage/edit.$id.tsx"),
  ]),
] satisfies RouteConfig;
