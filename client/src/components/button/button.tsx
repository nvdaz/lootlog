/* eslint-disable react/jsx-props-no-spreading */
import { h, FunctionalComponent, JSX } from 'preact';
import clsx from 'clsx';

import classes from './button.module.scss';

export const Button: FunctionalComponent<JSX.HTMLAttributes<
  HTMLAnchorElement
>> = ({ className, children, ...rest }) => {
  return (
    <a className={clsx(classes.button, className)} {...rest}>
      {children}
    </a>
  );
};

export const OutlinedButton: FunctionalComponent<JSX.HTMLAttributes<
  HTMLAnchorElement
>> = ({ className, children, ...rest }) => {
  return (
    <a className={clsx(classes.buttonOutlined, className)} {...rest}>
      {children}
    </a>
  );
};
