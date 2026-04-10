import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export class UsersService {
  static async registerUser(payload: any) {
    // 1. Check if email already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, payload.email));

    if (existingUser.length > 0) {
      throw new Error("Email sudah terdaftar");
    }

    // 2. Hash password using Bun's built-in hashing
    const hashedPassword = await Bun.password.hash(payload.password, {
      algorithm: "bcrypt",
      cost: 10,
    });

    // 3. Insert user into database
    await db.insert(users).values({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
    });

    return { status: "success", data: "OK" };
  }
}
