import { h } from 'preact';
import { useState } from 'preact/hooks';
import clsx from 'clsx';

import { Button } from '../button';
import accountCircle from '../../icons/accountCircle';
import useCurrentUser from '../../hooks/useCurrentUser';
import useUsers from '../../hooks/useUsers';
import classes from './header.module.scss';

export default function Header() {
  const { loggedIn, username } = useCurrentUser();
  const { loading, error, users } = useUsers();
  const [userFilter, setUserFilter] = useState('');

  const userFilterRegex = new RegExp(`^${userFilter}`, 'i');
  const filteredUsers = users.filter(
    ({ username, displayName }) =>
      userFilterRegex.test(username) || userFilterRegex.test(displayName),
  );

  return (
    <div className={classes.header}>
      <div className={classes.actions}>
        <div className={classes.dropdownParent}>
          <div>
            <Button
              className={classes.accountCircleButton}
              href={loggedIn ? undefined : '/auth/discord'}
            >
              <img
                className={classes.accountCircle}
                src={accountCircle}
                alt="User"
              />
            </Button>
            {loggedIn && (
              <div className={classes.dropdownContainerParent}>
                <div className={classes.dropdownContainer}>
                  <Button href="/setup">setup</Button>
                  <Button href="/settings">settings</Button>
                  <Button href={`/user/${username}`}>your loot</Button>
                  <Button href="/auth/logout">logout</Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className={classes.dropdownParent}>
          <div className={classes.group}>
            <input
              disabled={loading || error}
              required
              className={clsx(classes.input, error && classes.inputError)}
              value={userFilter}
              placeholder={
                error ? 'Error' : loading ? 'Loading ...' : 'Search ...'
              }
              onChange={({ target: { value } }) => setUserFilter(value)}
            />
          </div>
          {!(loading || error) && (
            <div className={classes.dropdownContainerParent}>
              <div className={classes.dropdownContainerSearch}>
                {filteredUsers.map(({ username, displayName }) => (
                  <Button href={`/user/${username}`}>{displayName}</Button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button className={classes.globalButton} href="/global">
          global
        </Button>
      </div>
      <a className={classes.title} href="/">
        Loot Log
      </a>
    </div>
  );
}
