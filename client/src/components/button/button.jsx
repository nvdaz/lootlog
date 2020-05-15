/* eslint-disable react/jsx-props-no-spreading */
import { h } from 'preact';
import clsx from 'clsx';

import classes from './button.module';

export function Button({ className, children, ...rest }) {
  return (
    <a className={clsx(classes.button, className)} {...rest}>
      {children}
    </a>
  );
}

export function OutlinedButton({ className, children, ...rest }) {
  return (
    <a className={clsx(classes.buttonOutlined, className)} {...rest}>
      {children}
    </a>
  );
}
