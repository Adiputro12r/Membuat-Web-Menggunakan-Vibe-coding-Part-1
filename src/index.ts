import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const app = new Elysia()
  .use(swagger())
  .get("/", () => ({
    status: "ok",
    message: "Server is running smoothly",
  }))
  .group("/users", (app) =>
    app
      // List all users
      .get("/", async () => {
        try {
          const allUsers = await db.select().from(users);
          return allUsers;
        } catch (error) {
          return {
            status: "error",
            message: "Failed to fetch users",
            details: error instanceof Error ? error.message : "Unknown error",
          };
        }
      })
      // Get user by id
      .get("/:id", async ({ params: { id } }) => {
        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.id, Number(id)));
          return user[0] ?? { status: "error", message: "User not found" };
        } catch (error) {
          return {
            status: "error",
            message: "Failed to fetch user",
            details: error instanceof Error ? error.message : "Unknown error",
          };
        }
      })
      // Create user
      .post(
        "/",
        async ({ body }) => {
          try {
            await db.insert(users).values(body);
            return { status: "success", message: "User created" };
          } catch (error) {
            return {
              status: "error",
              message: "Failed to create user",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
        {
          body: t.Object({
            name: t.String(),
            email: t.String({ format: "email" }),
          }),
        }
      )
      // Update user
      .patch(
        "/:id",
        async ({ params: { id }, body }) => {
          try {
            await db.update(users).set(body).where(eq(users.id, Number(id)));
            return { status: "success", message: "User updated" };
          } catch (error) {
            return {
              status: "error",
              message: "Failed to update user",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
        {
          body: t.Partial(
            t.Object({
              name: t.String(),
              email: t.String({ format: "email" }),
            })
          ),
        }
      )
      // Delete user
      .delete("/:id", async ({ params: { id } }) => {
        try {
          await db.delete(users).where(eq(users.id, Number(id)));
          return { status: "success", message: "User deleted" };
        } catch (error) {
          return {
            status: "error",
            message: "Failed to delete user",
            details: error instanceof Error ? error.message : "Unknown error",
          };
        }
      })
  )
  .listen(process.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log(`📑 Swagger documentation available at /swagger`);
