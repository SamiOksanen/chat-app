import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';

const httpUri = import.meta.env.VITE_APP_API_URL ? import.meta.env.VITE_APP_API_URL : (window.location.protocol === 'https:' ? 'https://' : 'http://') + window.location.host + '/api/v1/graphql';
const wsUri = import.meta.env.VITE_APP_API_URL ? import.meta.env.VITE_APP_API_URL.replace(/^https:/, 'wss:').replace(/^http:/, 'ws:') : (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/api/v1/graphql'; 

const httpLink = new HttpLink({
    uri: httpUri,
});

const wsLink = new GraphQLWsLink(createClient({
    url: wsUri,
    connectionParams: () => {
        return { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } };
    },
}));

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink),
);

const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache()
});

export default client;
