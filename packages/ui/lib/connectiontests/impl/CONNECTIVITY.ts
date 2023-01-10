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

const TEST_NAME = "Connectivity Test";
export default class CONNECTIVITY extends ConnectionTest {
  constructor(connectionTestRequest: ConnectionTestRequest) {
    super(connectionTestRequest);
  }

  run = (): Promise<ConnectionTestResult[]> => {
    const connectivityTestResult: ConnectionTestResult = {
      name: TEST_NAME,
      order: this.connectionTestRequest.order,
      message: "",
      detail: null,
      status: this.status,
    };

    const requestBody = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
      <soap:Header>
      <Action xmlns="http://www.w3.org/2005/08/addressing">urn:cdc:iisb:2014:IISPortType:ConnectivityTestRequest</Action>
      <MessageID xmlns="http://www.w3.org/2005/08/addressing">{{testMessageId}}</MessageID>
      <To xmlns="http://www.w3.org/2005/08/addressing">http://www.w3.org/2005/08/addressing/anonymous</To>
      </soap:Header>
      <soap:Body>
      <ConnectivityTestRequest xmlns="urn:cdc:iisb:2014" xmlns:ns2="urn:cdc:iisb:hub:2014" xmlns:ns3="urn:cdc:iisb:2011">
      <EchoBack>Wishing 
      ${this.connectionTestRequest.hostname} 
      :
      ${this.connectionTestRequest.port}
       an Audacious Hello at
      ${new Date()} 
      !</EchoBack>
      </ConnectivityTestRequest>
      </soap:Body>
      </soap:Envelope>`;

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
      path: this.connectionTestRequest.path,
      method: "POST",
      agent: new https.Agent(httpsAgentOptions),
      headers: {
        Host: this.connectionTestRequest.hostname,
        "Content-Type": "application/xml",
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        var data = "";
        var requestEchoback;
        var responseEchoback;

        res.on("data", (chunk) => {
          data = data + chunk.toString();
        });

        res.on("end", function () {
          if (res.statusCode == 200) {
            parser.parseString(data, function (err, result) {
              if (err) {
                resolve([
                  {
                    ...connectivityTestResult,
                    detail: err,
                    message: TestResponseMessages.UNKNOWN_ERROR(
                      options.hostname
                    ),
                    status: TestStatus.FAIL,
                  },
                ]);
              } else {
                responseEchoback =
                  result["soap:Envelope"]["soap:Body"][0][
                    "ConnectivityTestResponse"
                  ][0]["EchoBack"].toString();
              }
            });
            parser.parseString(requestBody, function (err, result) {
              requestEchoback =
                result["soap:Envelope"]["soap:Body"][0][
                  "ConnectivityTestRequest"
                ][0]["EchoBack"].toString();
            });

            if (requestEchoback === responseEchoback) {
              resolve([
                {
                  ...connectivityTestResult,
                  detail: { response: responseEchoback },
                  message: null,
                  status: TestStatus.PASS,
                },
              ]);
            } else if (responseEchoback.includes(requestEchoback)) {
              resolve([
                {
                  ...connectivityTestResult,
                  detail: { response: responseEchoback },
                  message: TestResponseMessages.CONNECTIVITY_WARNING(
                    requestEchoback,
                    responseEchoback
                  ),
                  status: TestStatus.WARNING,
                },
              ]);
            }
          } else if (
            requestEchoback !== responseEchoback ||
            !responseEchoback.includes(requestEchoback)
          ) {
            resolve([
              {
                ...connectivityTestResult,
                detail: { response: responseEchoback },
                message:
                  TestResponseMessages.CONNECTIVITY_ECHOBACK_NOT_EXPECTED,
                status: TestStatus.FAIL,
              },
            ]);
          }
        });
      });

      req.on("error", (error) => {
        resolve([
          {
            ...connectivityTestResult,
            detail: error,
            message: TestResponseMessages.UNKNOWN_ERROR(options.hostname),
            status: TestStatus.FAIL,
          },
        ]);
      });
      req.write(requestBody);
      req.end();
    });
  };
}
