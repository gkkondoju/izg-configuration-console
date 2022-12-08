import { ApolloClient, InMemoryCache } from "@apollo/client";

const uri = process.env.GRAPHQL_URL;

const apolloClientFactory = async () => {
  const isBrowser = typeof window !== "undefined";

  const cache = new InMemoryCache();
  const apolloClient = new ApolloClient({
    uri: isBrowser ? "http://localhost:4000" : "http://api:4000",
    cache,
  });

  return apolloClient;
};

export default apolloClientFactory;
