import Testable from "./Testable";
import { ConnectionTestRequest } from "./types/ConnectionTestRequest";
import DNS from "./impl/DNS";
import TCP from "./impl/TCP";
import TLS from "./impl/TLS";
import CIPHER from "./impl/CIPHER";

export default class ConnectionTestFactory {
  static getConnectionTest(
    testName: String,
    connectionTestRequest: ConnectionTestRequest
  ): Testable {
    if (testName === "dns") {
      return new DNS(connectionTestRequest);
    }
    if (testName === "tcp") {
      return new TCP(connectionTestRequest);
    }
    if (testName === "tls") {
      return new TLS(connectionTestRequest);
    }
    if (testName === "cipher") {
      return new CIPHER(connectionTestRequest);
    }
    return null as unknown as Testable;
  }
}
