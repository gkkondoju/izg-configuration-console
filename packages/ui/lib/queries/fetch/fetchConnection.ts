import { gql } from "@apollo/client";

export const FETCH_DESTINATION = gql`
  query DestinationById($destId: String!) {
    destinationById(dest_id: $destId) {
      dest_id
      dest_type {
        type
      }
      dest_uri
      dest_version
      jurisdiction {
        description
      }
    }
  }
`;
