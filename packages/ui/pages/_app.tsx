import * as React from "react";
import type { AppProps } from "next/app";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import apolloClientFactory from "../lib/apollo-client";
import Layout from "../components/Layout";
import "@fontsource/ubuntu/300.css";
import "@fontsource/ubuntu/400.css";
import "@fontsource/ubuntu/500.css";
import "@fontsource/ubuntu/700.css";
import createEmotionCache from "../utility/createEmotionCache";
import lightThemeOptions from "../styles/theme/lightThemeOptions";
import { SessionProvider } from '../contexts/session';
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const clientSideEmotionCache = createEmotionCache();
const lightTheme = createTheme(lightThemeOptions);

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const [client, setClient] = React.useState(undefined);
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  React.useEffect(() => {
    const initApolloClient = async () => {
      const apolloClient = await apolloClientFactory();
      setClient(apolloClient);
    };
    initApolloClient().catch(console.error);
  }, []);

  if (!client) {
    return <h1>Initializing application...</h1>;
  }

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <ApolloProvider client={client}>
          <Layout>
          <SessionProvider>
          <Component {...pageProps}/>
          </SessionProvider>
          </Layout>
        </ApolloProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default MyApp;
