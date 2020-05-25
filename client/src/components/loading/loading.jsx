import { h } from 'preact';

import Loader from '../../img/loader.svg';
import classes from './loading.module.scss';

export default function Loading() {
  return (
    <div className={classes.containerFlex}>
      <Loader />
    </div>
  );
}
