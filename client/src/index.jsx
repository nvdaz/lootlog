/* eslint-disable react/jsx-no-bind */

import { h, render } from 'preact';
import { Suspense, lazy } from 'preact/compat';
import Router, { route } from 'preact-router';
import GA from 'react-ga';
import { ApolloProvider } from '@apollo/client';

import apolloClient from './util/apollo';
import Header from './components/header';
import Loading from './components/loading';
import Home from './routes/home';
import ErrorPage from './routes/error';

import './styles';

const Global = lazy(() =>
  import(/* webpackModuleName: "global-page" */ './routes/global'),
);
const User = lazy(() =>
  import(/* webpackModuleName: "user-page" */ './routes/user'),
);
const Settings = lazy(() =>
  import(/* webpackModuleName: "settings-page" */ './routes/settings'),
);
const Setup = lazy(() =>
  import(/* webpackModuleName: "setup-page" */ './routes/setup'),
);
const Changelog = lazy(() =>
  import(/* webpackModuleName: "changelog-page" */ './routes/changelog'),
);

GA.initialize('UA-166314499-1');

const handleRoute = ({ url }) => {
  GA.pageview(url);
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
