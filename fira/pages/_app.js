import { ApolloProvider } from '@apollo/client';
// import Page from '../components/Page';
import withApollo from '../lib/apollo-client';
import '../styles/globals.css'

function App({ Component, pageProps, apollo }) {
  return <ApolloProvider client={apollo}><Component {...pageProps} /></ApolloProvider>
}
// nextjs grabs queries in children components
App.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    // if any page has getInitialProps on them (withData always passes it)
    // wait and go fetch it
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;
  return pageProps;
};
export default withApollo(App);


