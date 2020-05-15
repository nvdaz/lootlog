export const SMALL = 'SMALL';

export default function useSize() {
  return window.matchMedia('(max-width: 480px)').matches ? SMALL : null;
}
