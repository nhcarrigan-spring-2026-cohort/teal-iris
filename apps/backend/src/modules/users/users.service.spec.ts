import { jest } from "@jest/globals";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type * as schema from "../../db/schema.js";
import { UsersService } from "./users.service.js";

describe("UsersService", () => {
  it("creates a Google user with English as the native language", async () => {
    const createdUser = {
      id: "user-123",
      email: "new@example.com",
    };

    const findFirst = jest.fn().mockResolvedValue({
      id: "lang-en",
    });
    const returning = jest.fn().mockResolvedValue([createdUser]);
    const values = jest.fn().mockReturnValue({ returning });
    const insert = jest.fn().mockReturnValue({ values });

    const db = {
      query: {
        languages: {
          findFirst,
        },
      },
      insert,
    } as unknown as NodePgDatabase<typeof schema>;

    const service = new UsersService(db);

    const result = await service.createUser("new@example.com", "New User");

    expect(result).toBe(createdUser);

    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "new@example.com",
        passwordHash: "",
        firstName: "New",
        lastName: "User",
        nativeLanguageId: "lang-en",
      }),
    );
  });
});
