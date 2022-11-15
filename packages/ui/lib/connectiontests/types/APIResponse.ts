import { ConnectionTestResult } from "./ConnectionTestResult";

export type APIResponse = {
  destId: string;
  destUrl: string;
  destType: string;
  jurisdictionDescription: string;
  testResults: ConnectionTestResult[];
};
