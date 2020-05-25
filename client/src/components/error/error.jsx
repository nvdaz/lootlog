import { h } from 'preact';

import { NOT_FOUND, meta } from '../../errors';
import styles from './error.module.scss';

export default function Error({ error = NOT_FOUND }) {
  const { title, description } = meta(error);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <span className={styles.subtitle}>{description}</span>
    </div>
  );
}
