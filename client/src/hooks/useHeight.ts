import { Ref } from 'preact';
import { useRef, useState, useEffect, Inputs } from 'preact/hooks';

interface IUseHeightOptions {
  inputs: Inputs;
}

export default function useHeight<T extends HTMLElement = HTMLElement>({
  inputs,
}: IUseHeightOptions): [number, Ref<T>] {
  const ref = useRef<T>();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(
      Array.from(ref?.current?.children || []).reduce(
        (a, b) =>
          b instanceof HTMLElement
            ? a +
              b.offsetHeight +
              parseFloat(getComputedStyle(b).marginTop) +
              parseFloat(getComputedStyle(b).marginBottom)
            : a,
        0,
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, ...inputs]);

  return [height, ref];
}
