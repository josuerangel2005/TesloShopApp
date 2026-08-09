import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema:
    "modules/products/infrastructure/adapters/out/HandleProducts/persistence/prisma/schema.prisma",
  migrations: {
    path: "modules/products/infrastructure/adapters/out/HandleProducts/persistence/prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
