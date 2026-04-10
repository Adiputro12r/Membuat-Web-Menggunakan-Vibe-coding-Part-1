import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { usersRoute } from "./routes/users-route";

const app = new Elysia()
  .use(swagger())
  .get("/", () => ({
    status: "ok",
    message: "Server is running smoothly",
  }))
  .use(usersRoute)
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(`📑 Swagger documentation available at /swagger`);