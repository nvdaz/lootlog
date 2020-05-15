import { h } from 'preact';
import clsx from 'clsx';

import Loading from '../../components/loading';
import ErrorComponent from '../../components/error';
import useSettings from '../../hooks/useSettings';
import classes from './settings.module';

export default function Settings() {
  const {
    loading,
    error,
    currentDisplayName,
    currentEyePrice,
    currentUsername,
    setDisplayName,
    setEyePrice,
    setUsername,
    setDisplayNameError,
    setEyePriceError,
    setUsernameError,
  } = useSettings();

  if (loading) return <Loading />;
  if (error) return <ErrorComponent error={error} />;

  return (
    <form className={clsx(classes.form, classes.container)}>
      <div className={classes.group}>
        <input
          required
          className={classes.input}
          value={currentUsername}
          onChange={({ target: { value } }) => setUsername(value)}
        />
        <span className={classes.label}>Username</span>
        {setUsernameError && (
          <span className={classes.error}>{setUsernameError}</span>
        )}
      </div>
      <div className={classes.group}>
        <input
          required
          className={classes.input}
          value={currentDisplayName}
          onChange={({ target: { value } }) => setDisplayName(value)}
        />
        <span className={classes.label}>Display Name</span>
        {setUsernameError && (
          <span className={classes.error}>{setDisplayNameError}</span>
        )}
      </div>
      <div className={classes.group}>
        <input
          required
          className={classes.input}
          type="number"
          value={currentEyePrice}
          onChange={({ target: { value } }) => setEyePrice(parseInt(value, 10))}
        />
        <span className={classes.label}>Eye Price</span>
        {setUsernameError && (
          <span className={classes.error}>{setEyePriceError}</span>
        )}
      </div>
    </form>
  );
}
