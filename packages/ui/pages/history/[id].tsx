import * as React from "react";
import Container from "../../components/Container";
import ConnectionHistory from "../../components/ConnectionHistory/index";
import {useRouter} from "next/router";
import ErrorBoundary from "../../components/ErrorBoundary";

const HistoryPage = () => {
    const router= useRouter();
    return (
      <Container title="Connection History">
        <ErrorBoundary>
        <ConnectionHistory destId={router.query.id}/>
        </ErrorBoundary>
      </Container>
    );
  };
  
  export default HistoryPage;