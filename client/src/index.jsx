import { h, render } from 'preact';
import { Suspense } from 'preact/compat';
import Router, { route } from 'preact-router';
import { initialize, pageview } from 'react-ga';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './util/apollo';
import Header from './components/header';
import Loading from './components/loading';
import {
  Home,
  ErrorPage,
  Global,
  User,
  Settings,
  Setup,
  Changelog,
} from './routes';
import './styles.scss';

initialize('UA-166314499-1');

const handleRoute = ({ url }) => {
  pageview(url);
  if (url.endsWith('?redirecting')) return;
  if (url === '/download' || url.startsWith('/auth')) {
    route('/downloading');
    window.location = `${url}?redirecting`;
  }
};

render(
  <ApolloProvider client={apolloClient}>
    <Header />
    <Suspense fallback={Loading}>
      <Router onChange={handleRoute}>
        <Home path="/" />
        <Global path="/global" />
        <User path="/user/:username" />
        <Settings path="/settings" />
        <Setup path="/setup" />
        <Changelog path="/changelog/:from?" />
        <ErrorPage default />
      </Router>
    </Suspense>
  </ApolloProvider>,
  document.body,
);
