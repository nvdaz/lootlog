import { h } from 'preact';

import loader from '../../img/loader.svg';
import classes from './loading.module';

export default function Loading() {
  return (
    <div className={classes.containerFlex}>
      <img className={classes.loader} src={loader} alt="Loading" />
    </div>
  );
}
