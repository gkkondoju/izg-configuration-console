import ConnectionTest from "../ConnectionTest";
import { ConnectionTestRequest } from "../types/ConnectionTestRequest";
import { ConnectionTestResult } from "../types/ConnectionTestResult";
import { TestStatus } from "../TestStatus";
import { TestResponseMessages } from "../TestResponseMessages";

const TEST_NAME = "DNS Lookup Test";

export default class DNS extends ConnectionTest {
  constructor(connectionTestRequest: ConnectionTestRequest) {
    super(connectionTestRequest);
  }

  run = (): Promise<ConnectionTestResult[]> => {
    const dns = require("dns");
    const dnsConnectionTestResult: ConnectionTestResult = {
      name: TEST_NAME,
      order: this.connectionTestRequest.order,
      message: "",
      detail: null,
      status: this.status,
    };

    return new Promise((resolve, reject) => {
      dns.lookup(
        this.connectionTestRequest.hostname,
        (error: any, address: any, family: any) => {
          resolve([
            {
              ...dnsConnectionTestResult,
              detail: error || {
                address: address,
                family: family,
              },
              message: error
                ? TestResponseMessages.DNS_LOOKUP_FAIL(
                    this.connectionTestRequest.hostname
                  )
                : "",
              status: error ? TestStatus.FAIL : TestStatus.PASS,
            },
          ]);
        }
      );
    });
  };
}
