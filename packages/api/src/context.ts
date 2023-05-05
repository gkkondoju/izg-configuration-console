import { PrismaClient } from "@prisma/client";
import { audit_history_changeType } from "@prisma/client";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import fetch from "node-fetch";

const showSql =
  process.env.SHOW_SQL_IN_CONSOLE?.toLocaleLowerCase() === "true" || false;

const prisma = new PrismaClient({
  log: showSql ? ["query", "info", "warn", "error"] : [],
});

const auditMiddleware = async (params, next) => {
  // const session = await getSession();
  // const userName = session?.user?.name ?? 'anonymous';

  // // Ignore audit log for authentication actions
  // if (params.action !== ) {
  //   return next(params);
  // }
  const response = await fetch("http://localhost:3000/api/auth/session");
  const statusResponse = await response.json();
  console.log(response.status);

  if (
    !["create", "update", "delete"].includes(params.action) ||
    params.model === "audit_history"
  ) {
    return next(params);
  }

  if (params.action === "create") {
    const auditTrailData = {
      tableName: params.model,
      userName: "userName",
      changeType: audit_history_changeType.Insert,
      oldValues: {},
      newValues: params.args.data,
      createdAt: new Date(),
    };

    await prisma.audit_history.create({ data: auditTrailData });
  }
  if (params.action === "update") {
    const record = await prisma[params.model.toString()].findUnique({
      where: { dest_id: params.args.where.dest_id },
    });

    const auditTrailData = {
      tableName: params.model,
      userName: "userName",
      changeType: audit_history_changeType.Update,
      oldValues: record || { error: "Undefined" },
      newValues: params.args.data,
      createdAt: new Date(),
    };

    await prisma.audit_history.create({ data: auditTrailData });
  } else if (params.action === "delete") {
    const record = await prisma[params.model.toString()].findUnique({
      where: { dest_id: params.args.where.dest_id },
    });
    const auditTrailData = {
      tableName: params.model,
      userName: "userName",
      changeType: audit_history_changeType.Delete,
      oldValues: record,
      newValues: params.args.data,
      createdAt: new Date(),
    };
    await prisma.audit_history.create({ data: auditTrailData });
  }
  const result = await next(params);
  return result;
};

prisma.$use(auditMiddleware);

export interface Context {
  prisma: PrismaClient;
  session: {
    user: {
      name: string;
      email: string;
      image: string;
    };
  };
}

export const context = {
  prisma: prisma,
};
