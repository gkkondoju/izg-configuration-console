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
export default class QBP extends ConnectionTest {
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

    const requestBody = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:urn="urn:cdc:iisb:hub:2014" xmlns:urn1="urn:cdc:iisb:2014">
    <soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
      <urn:HubRequestHeader>
        <urn:DestinationId>devwup</urn:DestinationId>
      </urn:HubRequestHeader>
      <wsa:Action>urn:cdc:iisb:hub:2014:IISHubPortType:SubmitSingleMessageRequest</wsa:Action>
      <wsa:MessageID>{{testMessageId}}</wsa:MessageID>
    </soap:Header>
    <soap:Body>
      <urn1:SubmitSingleMessageRequest>
        <urn1:Username>Username</urn1:Username>
        <urn1:Password>Password</urn1:Password>
        <urn1:FacilityID>IZG</urn1:FacilityID>
        <urn1:Hl7Message>MSH|^~\\&amp;|SIISCLIENT28374|SIISCLIENT28374|TEST|TC_04|20210402091512.000-0100||QBP^Q11^QBP_Q11|20210330093013AZQ231|P|2.5.1|||ER|AL|||||Z34^CDCPHINVS|SIISCLIENT28374|\nQPD|Z34^Request Immunization History^CDCPHINVS|20210330093013LA231|LAMASM77BF4BA6^^^IZGATEWAYTEST&amp;2.16.840.1.113883.40.1&amp;ISO^MR|Johnson^James^Andrew^^^^L|Leung^Jen^^^^^M|20160414|M|Main Street&amp;&amp;123^^New Orleans^LA^70115^^L|^PRN^PH^^^555^5551111|Y|1</urn1:Hl7Message>
      </urn1:SubmitSingleMessageRequest>
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
          console.log(data)
        });

        res.on("end", function () {
          if (res.statusCode == 200) {
            parser.parseString(requestBody, function (err, result) {
              responseEchoback =
                result["soap:Envelope"]["soap:Body"][0]["Hl7Message"][0].toString();
            });
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
