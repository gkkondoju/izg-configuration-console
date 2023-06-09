import { URL } from "url";
import apolloClientFactory from "../../../../lib/apollo-client";
import { FETCH_DESTINATION } from "../../../../lib/queries/fetch";
import type { NextApiRequest, NextApiResponse } from "next";
import { constants } from "http2";
import { ConnectionTestRequest } from "../../../../lib/connectiontests/types/ConnectionTestRequest";
import { ConnectionTestResult } from "../../../../lib/connectiontests/types/ConnectionTestResult";
import ConnectionTestFactory from "../../../../lib/connectiontests/ConnectionTestFactory";
import { APIResponse } from "../../../../lib/connectiontests/types/APIResponse";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<APIResponse>
) {
  const DEFAULT_PORT = 443;
  const {
    query: { id },
    method,
  } = request;
  const testSuite: string[] = ["dns", "tcp", "tls", "cipher"];
  const testResults: ConnectionTestResult[] = [];

  const destination = await lookupDestinationURL(id);

  if (!destination) {
    response.status(constants.HTTP_STATUS_NOT_FOUND).json({
      destId: id,
      destUrl: "unknown",
      destType: "",
      jurisdictionDescription: "",
      message: `The requested destination ${id} was not found in our records`,
      isSuccess: false,
      testResults: [],
    });
  }

  if (destination && !isValidUrl(destination.data?.destinationById.dest_uri)) {
    response.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      destId: id,
      destUrl: destination.data?.destinationById.dest_uri,
      destType: destination.data?.destinationById.dest_type.type,
      jurisdictionDescription:
        destination.data?.destinationById.jurisdiction.description,
      message: `The URL retrieved for ${id} is malformed`,
      isSuccess: false,
      testResults: [],
    });
  }

  const destIdURL = convertUrlStringToUrlObject(
    destination.data?.destinationById.dest_uri
  );

  const connectionTestRequest: ConnectionTestRequest = {
    ip: "",
    port: +destIdURL.port || DEFAULT_PORT,
    hostname: destIdURL.hostname,
    path: destIdURL.pathname,
    order: 0,
  };

  console.info(
    "STARTING TESTS ON DEST ID: " +
      id +
      " USING URL: " +
      connectionTestRequest.hostname +
      " ON PORT: " +
      connectionTestRequest.port
  );

  let testCounter = 0;
  for (const test of testSuite) {
    console.info("running test: " + test);
    connectionTestRequest.order = ++testCounter;
    const T = ConnectionTestFactory.getConnectionTest(
      test,
      connectionTestRequest
    );
    const result = await T.run();
    testResults.push(...result);
    if (test === "dns" && result[0]?.detail?.address) {
      console.debug("Resolved IP address is: " + result[0]?.detail?.address);
      connectionTestRequest.ip = result[0]?.detail?.address;
    }
  }

  response.status(200).json({
    destId: id || "unknown",
    destUrl: destIdURL.hostname || "unknown",
    destType: destination.data?.destinationById.dest_type.type || "unknown",
    jurisdictionDescription:
      destination.data?.destinationById.jurisdiction?.description || "unknown",
    testResults: testResults,
  });
}

async function lookupDestinationURL(destId: string) {
  const apolloClient = await apolloClientFactory();
  return await queryDestination(destId, apolloClient);
}

const queryDestination = async (destId: String, apolloClient: any) => {
  try {
    return await apolloClient.query({
      query: FETCH_DESTINATION,
      variables: { destId: destId },
    });
  } catch (e) {
    console.log(
      `Error ---> could not get record for ${destId} using FETCH_DESTINATION query: ${e}`
    );
  }
  return null;
};

const convertUrlStringToUrlObject = (urlString: string) => {
  return new URL(urlString);
};

const isValidUrl = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};
