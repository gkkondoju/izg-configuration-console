import { gql } from "@apollo/client";

export const DESTINATION_INFO = gql`
query DestinationInfoByDestId($destId: String!) {
    destinationById(dest_id: $destId) {
      dest_id
      dest_uri
      dest_type {
        type
      }
      status {
        status
      }
      jurisdiction {
        description
      }
    }
  }
`;

export const STATUS_HISTORY = gql `
query EndpointStatusHistoryByDestId($destId: String! ) {
  endpointStatusHistoryByDestId(dest_id: $destId) {
    status
    ran_at
    id
  }
  statusHistoryInterval {
    historyInterval
  }
}`
