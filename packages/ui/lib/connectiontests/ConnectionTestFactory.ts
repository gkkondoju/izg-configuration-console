import Testable from "./Testable";
import { ConnectionTestRequest } from "./types/ConnectionTestRequest";
import DNS from "./impl/DNS";
import TCP from "./impl/TCP";
import TLS from "./impl/TLS";
import CIPHER from "./impl/CIPHER";
import WSDL from "./impl/WSDL";
import CONNECTIVITY from "./impl/CONNECTIVITY";

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
    if (testName === "wsdl") {
      return new WSDL(connectionTestRequest);
    }
    if (testName === "connectivity") {
      return new CONNECTIVITY(connectionTestRequest);
    }
    return null as unknown as Testable;
  }
}
