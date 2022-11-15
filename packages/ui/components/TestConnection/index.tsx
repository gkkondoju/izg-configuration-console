import * as React from "react";
import TestSkeleton from "../../components/Skeleton";
import { useState, useEffect } from "react";
import Close from "../Close";
import { Container } from "@mui/material";
import TestsList from "./testsList";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { DESTINATION_INFO } from "../../lib/queries/history/connectionhistory";

const TestConnection = () => {
  const [testResults, setTestResults] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const TEST_API_DOMAIN =
    process.env.ENDPOINT_TEST_API_DOMAIN || "http://localhost:3000";

  useEffect(() => {
    setLoading(true);
    fetch(`${TEST_API_DOMAIN}/api/tests/connectiontest/${id}`)
      .then((res) => res.json())
      .then((testResults) => {
        setTestResults(testResults.testResults);
        setLoading(false);
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, [id]);

  const {
    loading,
    error,
    data: destInfo,
  } = useQuery(DESTINATION_INFO, {
    variables: { destId: id },
  });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div sx={{ position: "relative" }}>
      <div>
        <Close />
        <Container maxWidth="md">
          {isLoading || loading ? (
            <TestSkeleton />
          ) : (
            <TestsList data={testResults} {...destInfo} />
          )}
        </Container>
      </div>
    </div>
  );
};

export default TestConnection;
