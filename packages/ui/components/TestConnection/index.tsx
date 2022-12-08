import * as React from "react";
import TestSkeleton from "../../components/Skeleton";
import { useState, useEffect } from "react";
import Close from "../Close";
import { Box, Container } from "@mui/material";
import TestsList from "./testsList";
import { useRouter } from "next/router";

const TestConnection = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tests, setTests] = useState([]);
  const [jurisdiction, setJurisdiction] = useState("");
  const [type, setType] = useState("");
  const router = useRouter();
  const { id } = router.query;
  const TEST_API_DOMAIN =
    process.env.ENDPOINT_TEST_API_DOMAIN || "http://localhost:3000";

  useEffect(() => {
    if (!router.isReady) return;
    setError(null);
    setLoading(true);
    console.log("DEBUG ---> getting health of " + id);
    fetch(`${TEST_API_DOMAIN}/api/tests/connectiontest/${id}`)
      .then((res) => {
        if (!res.ok) {
          setError(res.statusText);
        }
        return res.json();
      })
      .then((data) => {
        setType(data.destType);
        setTests(data.testResults);
        setJurisdiction(data.jurisdictionDescription);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id, router.isReady]);

  if (error) {
    setLoading(false);
    throw new Error(error);
  }

  return (
    <Box sx={{ position: "relative" }}>
      <div>
        <Close />
        <Container maxWidth="md">
          {isLoading ? (
            <TestSkeleton />
          ) : (
            <TestsList
              testResults={tests}
              destination={jurisdiction}
              destinationType={type}
            />
          )}
        </Container>
      </div>
    </Box>
  );
};

export default TestConnection;
