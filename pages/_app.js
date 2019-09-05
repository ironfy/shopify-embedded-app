import App from 'next/app'; // Next app component
import Head from 'next/head'; // Next head component
import { AppProvider } from '@shopify/polaris'; // The Polaris provider
import { Provider } from '@shopify/app-bridge-react'; // App bridge component
import '@shopify/polaris/styles.css'; // Import the styles
import Cookies from 'js-cookie'; // Cookies module
import ApolloClient from 'apollo-boost'; // Apollo client package
import { ApolloProvider } from 'react-apollo'; // Apollo provider comp.

// Apollo client setup
const client = new ApolloClient({
    fetchOptions: {
        credentials: 'include'
    },
});

class MyApp extends App {
    render() {
        const { Component, pageProps } = this.props;
        const config = { apiKey: API_KEY, shopOrigin: Cookies.get("shopOrigin"), forceRedirect: true };
        return (
            <React.Fragment>
                <Head>
                    <title>Sample App</title>
                    <meta charSet="utf-8" />
                </Head>
                <Provider config={config}>
                    <AppProvider>
                        <ApolloProvider client={client}>
                            <Component {...pageProps} />
                        </ApolloProvider>
                    </AppProvider>
                </Provider>
            </React.Fragment>
        );
    }
}

export default MyApp;