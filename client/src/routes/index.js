import { lazy } from 'preact/compat';

export { default as Home } from './home';
export { default as ErrorPage } from './error';

export const Global = lazy(() =>
  import(/* webpackModuleName: "global-page" */ './global'),
);
export const User = lazy(() =>
  import(/* webpackModuleName: "user-page" */ './user'),
);
export const Settings = lazy(() =>
  import(/* webpackModuleName: "settings-page" */ './settings'),
);
export const Setup = lazy(() =>
  import(/* webpackModuleName: "setup-page" */ './setup'),
);
export const Changelog = lazy(() =>
  import(/* webpackModuleName: "changelog-page" */ './changelog'),
);
