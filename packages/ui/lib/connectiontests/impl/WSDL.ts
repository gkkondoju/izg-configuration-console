import ConnectionTest from "../ConnectionTest";
import { ConnectionTestRequest } from "../types/ConnectionTestRequest";
import { ConnectionTestResult } from "../types/ConnectionTestResult";
import { TestStatus } from "../TestStatus";
import https from "https";
import { TestResponseMessages } from "../TestResponseMessages";
var fs = require("fs");
import path from "path";
var xml2js = require("xml2js");
var parser = new xml2js.Parser();

const TEST_NAME = "WSDL Test";
export default class WSDL extends ConnectionTest {
  constructor(connectionTestRequest: ConnectionTestRequest) {
    super(connectionTestRequest);
  }

  run = (): Promise<ConnectionTestResult[]> => {
    const wsdlConnectionTestResult: ConnectionTestResult = {
      name: TEST_NAME,
      order: this.connectionTestRequest.order,
      message: "",
      detail: null,
      status: this.status,
    };

    const IZG_ENDPOINT_CERT_DIR_PATH =
      process.env.IZG_ENDPOINT_CERT_DIR_PATH || "unknown";
    const IZG_ENDPOINT_PASSCODE = process.env.IZG_ENDPOINT_PASSCODE || "";

    const crtPath = fs
      .readdirSync(IZG_ENDPOINT_CERT_DIR_PATH)
      .filter((fn) => fn.endsWith(".crt"))[0];

    const keyPath = fs
      .readdirSync(IZG_ENDPOINT_CERT_DIR_PATH)
      .filter((fn) => fn.endsWith(".key"))[0];

    const httpsAgentOptions = {
      cert: fs.readFileSync(
        path.resolve(IZG_ENDPOINT_CERT_DIR_PATH, crtPath),
        `utf-8`
      ),
      key: fs.readFileSync(
        path.resolve(IZG_ENDPOINT_CERT_DIR_PATH, keyPath),
        "utf-8"
      ),
      passphrase: IZG_ENDPOINT_PASSCODE,
      rejectUnauthorized: false,
      keepAlive: true,
    };

    const options = {
      hostname: this.connectionTestRequest.hostname,
      port: this.connectionTestRequest.port,
      path: this.connectionTestRequest.path + "?wsdl",
      method: "GET",
      agent: new https.Agent(httpsAgentOptions),
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";
        var targetNameSpace = "";
        if (res.statusCode == 200) {
          res.on("data", (chunk) => {
            data = data + chunk.toString();
          });

          res.on("end", function () {
            parser.parseString(data, function (err, result) {
              if (err) {
                resolve([
                  {
                    ...wsdlConnectionTestResult,
                    detail: err,
                    message: TestResponseMessages.UNKNOWN_ERROR(
                      options.hostname
                    ),
                    status: TestStatus.FAIL,
                  },
                ]);
              } else {
                targetNameSpace =
                  result["definitions"]["$"]["targetNamespace"].toString();
                if (
                  targetNameSpace === "urn:cdc:iisb:2014" ||
                  targetNameSpace === "urn:cdc:iisb:2011"
                ) {
                  resolve([
                    {
                      ...wsdlConnectionTestResult,
                      detail: { targetNameSpace: targetNameSpace },
                      status: TestStatus.PASS,
                    },
                  ]);
                } else {
                  resolve([
                    {
                      ...wsdlConnectionTestResult,
                      detail: { targetNameSpace: targetNameSpace },
                      message:
                        TestResponseMessages.WSDL_NOT_SUPPORTED(
                          targetNameSpace
                        ),
                      status: TestStatus.FAIL,
                    },
                  ]);
                }
              }
            });
          });
        } else {
          resolve([
            {
              ...wsdlConnectionTestResult,
              message: TestResponseMessages.WSDL_NOT_ACCESSED,
              status: TestStatus.FAIL,
            },
          ]);
        }
      });

      req.on("error", (error) => {
        resolve([
          {
            ...wsdlConnectionTestResult,
            detail: error,
            message: TestResponseMessages.UNKNOWN_ERROR(options.hostname),
            status: TestStatus.FAIL,
          },
        ]);
      });

      req.end();
    });
  };
}