import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloLink,
} from "@apollo/client";

const uri = process.env.GRAPHQL_URL;

const apolloClientFactory = async () => {
  const httpLink = createHttpLink({ uri });
  const link = ApolloLink.from([httpLink]);
  const cache = new InMemoryCache();

  const apolloClient = new ApolloClient({
    link,
    cache,
  });

  return apolloClient;
};

export default apolloClientFactory;
