import { PrismaClient } from "@prisma/client";
import { audit_history_changeType } from "@prisma/client";

const showSql =
  process.env.SHOW_SQL_IN_CONSOLE?.toLocaleLowerCase() === "true" || false;

const prisma = new PrismaClient({
  log: showSql ? ["query", "info", "warn", "error"] : [],
});

prisma.$use(async (params, next) => {
  
  let changeType;
  let oldValues={};
  let newValues={};
  //It is good to have prams.model here to have better performance
  if (params.model === "jurisdiction" && params.action === "create") {
    newValues= params.args.data
    changeType= audit_history_changeType.Insert;

  } 
  else if (params.model === "destinations" && params.action === "update") {
    oldValues = await prisma[params.model.toString()].findUnique({
                    where: { dest_id: params.args.where.dest_id },
                });
    newValues= params.args.data
    changeType= audit_history_changeType.Update;
  } 
  else if (params.action === 'delete') {
    oldValues = await prisma[params.model.toString()].findUnique({ where: { dest_id: params.args.where.dest_id } });
    changeType = audit_history_changeType.Delete;
  }

  const auditTrailData = {
    tableName: params.model,
    userName: "user",
    changeType,
    oldValues,
    newValues,
    createdAt: new Date(),
  };

   prisma.audit_history.create({ data: auditTrailData });
  return await next(params);
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
