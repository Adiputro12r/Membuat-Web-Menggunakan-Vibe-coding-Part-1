import { Elysia, t } from "elysia";
import { UsersService } from "../services/users-service";

export const usersRoute = new Elysia({ prefix: "/api" })
  .post(
    "/users",
    async ({ body, set }) => {
      try {
        const result = await UsersService.registerUser(body);
        return result;
      } catch (error: any) {
        set.status = 400;
        return { error: error.message || "Unknown error" };
      }
    },
    {
      body: t.Object({
        name: t.String(),
        email: t.String({ format: "email" }),
        password: t.String(),
      }),
    }
  );
