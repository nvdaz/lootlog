import { useState, useEffect } from 'preact/hooks';

export enum TransitionState {
  ENTERED,
  ENTERING,
  EXITING,
  EXITED,
}

interface ITransitionOptions {
  timeout: number;
  isOpen: boolean;
}

export default function useTransition({
  timeout,
  isOpen,
}: ITransitionOptions): TransitionState {
  const [open, setOpen] = useState(
    isOpen ? TransitionState.ENTERED : TransitionState.EXITED,
  );

  useEffect(() => {
    if (open === (isOpen ? TransitionState.ENTERED : TransitionState.EXITED))
      return (): void => undefined;

    const previousState = open;
    setOpen(
      previousState === TransitionState.ENTERED
        ? TransitionState.EXITING
        : TransitionState.ENTERING,
    );
    const id = setTimeout(
      () =>
        setOpen(
          previousState === TransitionState.ENTERED
            ? TransitionState.EXITED
            : TransitionState.ENTERED,
        ),
      timeout,
    );
    return (): void => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return open;
}
