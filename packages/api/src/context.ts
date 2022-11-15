import { PrismaClient } from "@prisma/client";

const showSql =
  process.env.SHOW_SQL_IN_CONSOLE?.toLocaleLowerCase() === "true" || false;

console.info("Showing SQL in console: " + showSql);

const prisma = new PrismaClient({
  log: showSql ? ["query", "info", "warn", "error"] : [],
});

// prisma.$on("query", (e) => {
//   console.log("Query: " + e.query);
//   console.log("Params: " + e.params);
//   console.log("Duration: " + e.duration + "ms");
// });
export interface Context {
  prisma: PrismaClient;
}

export const context: Context = {
  prisma: prisma,
};
