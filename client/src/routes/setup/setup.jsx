import { h } from 'preact';
import { Link } from 'preact-router';

import { UNAUTHENTICATED } from '../../errors';
import ErrorComponent from '../../components/error';
import Loading from '../../components/loading';
import useCurrentUser from '../../hooks/useCurrentUser';
import classes from './setup.module';

export default function Setup() {
  const { loggedIn, loading, minecraft } = useCurrentUser();

  if (loading) return <Loading />;
  if (!loggedIn) return <ErrorComponent error={UNAUTHENTICATED} />;

  return (
    <div className={classes.containerFlex}>
      {!minecraft && (
        <div className={classes.step}>
          <h3>
            {'1. '}
            <Link href="/settings" className={classes.link}>
              Link
            </Link>
            {' Minecraft Account'}
          </h3>
        </div>
      )}
      <div className={classes.step}>
        <h3>
          {!minecraft && '2. '}
          <Link href="/download" className={classes.link}>
            Download
          </Link>
          {' Forge mod'}
        </h3>
      </div>
    </div>
  );
}
