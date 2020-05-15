import { h } from 'preact';

import useCurrentUser from '../../hooks/useCurrentUser';
import { OutlinedButton } from '../../components/button';
import classes from './home.module';

export default function Home() {
  const { loggedIn } = useCurrentUser();

  return (
    <div className={classes.containerFlex}>
      <h1 className={classes.title}>
        Loot
        <br className={classes.br} />
        Log
      </h1>
      <div className={classes.separator} />
      <h2 className={classes.subtitle}>
        Premier automatic loot-tracking service.
        <br />
        {!loggedIn && <OutlinedButton>login</OutlinedButton>}
      </h2>
    </div>
  );
}
