import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "modules/shared/ui-state/infrastructure/adapters/out/Persistence/prisma/schema.prisma",
  migrations: {
    path: "modules/shared/ui-state/infrastructure/adapters/out/Persistence/prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
