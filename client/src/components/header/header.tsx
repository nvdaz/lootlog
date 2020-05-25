import { h, Fragment, VNode, FunctionalComponent, JSX } from 'preact';
import { useState, useRef } from 'preact/hooks';
import { route } from 'preact-router';
import clsx from 'clsx';
import TimelineIcon from '../../icons/timeline.svg';
import AccountCircleIcon from '../../icons/accountCircle.svg';
import useCurrentUser from '../../hooks/useCurrentUser';
import { Button } from '../button';
import useTransition, { TransitionState } from '../../hooks/useTransition';
import useHeight from '../../hooks/useHeight';
import classes from './header.module.scss';

interface INavItemProps {
  onClick?: () => void;
  icon?: FunctionalComponent<JSX.SVGAttributes<SVGSVGElement>>;
  dropdown?: FunctionalComponent<unknown>;
}

function NavItem({
  onClick,
  icon: Icon,
  dropdown: Dropdown,
}: INavItemProps): VNode<INavItemProps> {
  const [open, setOpen] = useState(false);

  return (
    <li className={classes.navItem}>
      <button
        className={classes.iconButton}
        onClick={(): void => (onClick == null ? setOpen(!open) : onClick())}
        type="button"
      >
        <Icon />
      </button>
      {open && <Dropdown />}
    </li>
  );
}

enum AccountDropdownState {
  MAIN,
  YOUR_LOOT,
}

function AccountDropdown(): VNode {
  const ref = useRef<HTMLDivElement>();
  const [active, setActive] = useState<AccountDropdownState>(
    AccountDropdownState.MAIN,
  );
  const mainState = useTransition({
    timeout: 300,
    isOpen: active === AccountDropdownState.MAIN,
  });
  const [mainHeight, mainRef] = useHeight<HTMLDivElement>({
    inputs: [active, mainState],
  });
  const lootState = useTransition({
    timeout: 300,
    isOpen: active === AccountDropdownState.YOUR_LOOT,
  });
  const [lootHeight, lootRef] = useHeight<HTMLDivElement>({
    inputs: [active, mainState],
  });

  return (
    <Fragment>
      <div
        className={classes.dropdown}
        style={{
          height:
            active === AccountDropdownState.MAIN
              ? mainHeight
              : active === AccountDropdownState.YOUR_LOOT
              ? lootHeight
              : 0,
        }}
        ref={ref}
      >
        {mainState !== TransitionState.EXITED && (
          <div
            ref={mainRef}
            className={clsx(
              classes.dropdownComponent,
              mainState === TransitionState.EXITING &&
                classes.dropdownComponentTransformL,
              mainState === TransitionState.ENTERING &&
                classes.dropdownComponentTransformR,
            )}
          >
            <Button>download</Button>
            <Button href="/settings">settings</Button>
            <Button
              onClick={(): void =>
                void setActive(AccountDropdownState.YOUR_LOOT)
              }
            >
              your loot
            </Button>
            <Button href="/auth/logout">logout</Button>
          </div>
        )}
        {lootState !== TransitionState.EXITED && (
          <div
            ref={lootRef}
            className={clsx(
              classes.dropdownComponent,
              lootState === TransitionState.EXITING &&
                classes.dropdownComponentTransformL,
              lootState === TransitionState.ENTERING &&
                classes.dropdownComponentTransformR,
            )}
          >
            <Button
              onClick={(): void => void setActive(AccountDropdownState.MAIN)}
            >
              Back
            </Button>
            <Button href="/profile">Profile</Button>
            <Button href="/dragons">Dragons</Button>
            <Button href="/slayers">Slayers</Button>
            <Button href="/golems">Golems</Button>
            <Button href="/dungeons">Dungeons</Button>
          </div>
        )}
      </div>
    </Fragment>
  );
}

export default function Header(): VNode {
  const { loggedIn } = useCurrentUser();

  return (
    <nav className={classes.navbar}>
      <ul className={classes.nav}>
        <NavItem
          icon={TimelineIcon}
          onClick={(): void => void route('/stats')}
        />
        <NavItem
          icon={AccountCircleIcon}
          dropdown={AccountDropdown}
          onClick={
            loggedIn ? undefined : (): void => void route('/auth/discord')
          }
        />
      </ul>
    </nav>
  );
}
