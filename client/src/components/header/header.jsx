import { h } from 'preact';
import { useState } from 'preact/hooks';

import { Button, OutlinedButton } from '../button';
import accountCircle from '../../img/accountCircle.svg';
import useCurrentUser from '../../hooks/useCurrentUser';
import useUsers from '../../hooks/useUsers';
import useSize from '../../hooks/useSize';
import classes from './header.module';

export default function Header() {
  const { loggedIn, username } = useCurrentUser();
  const users = useUsers();
  const [userFilter, setUserFilter] = useState('');
  const size = useSize();

  const userFilterRegex = new RegExp(`^${userFilter}`, 'i');
  const filteredUsers = users.filter(
    ({ username, displayName }) =>
      userFilterRegex.test(username) || userFilterRegex.test(displayName),
  );

  return (
    <div className={classes.header}>
      <div className={classes.actions}>
        {loggedIn ? (
          <div className={classes.dropdownParent}>
            <div>
              <Button className={classes.accountCircleButton}>
                <img
                  className={classes.accountCircle}
                  src={accountCircle}
                  alt="User"
                />
              </Button>
              <div className={classes.dropdownContainerParent}>
                <div className={classes.dropdownContainer}>
                  <Button href="/setup">setup</Button>
                  <Button href="/settings">settings</Button>
                  <Button href={`/user/${username}`}>your loot</Button>
                  <Button href="/auth/logout">logout</Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <OutlinedButton href="/auth/discord">
            {size === 'SMALL' ? (
              <img src={accountCircle} alt="User" />
            ) : (
              'login'
            )}
          </OutlinedButton>
        )}
        <div className={classes.dropdownParent}>
          <div className={classes.group}>
            <input
              required
              className={classes.input}
              value={userFilter}
              placeholder="Search ..."
              onChange={({ target: { value } }) => setUserFilter(value)}
            />
          </div>
          <div className={classes.dropdownContainerParent}>
            <div className={classes.dropdownContainerSearch}>
              {filteredUsers.map(({ username, displayName }) => (
                <Button href={`/user/${username}`}>{displayName}</Button>
              ))}
            </div>
          </div>
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
