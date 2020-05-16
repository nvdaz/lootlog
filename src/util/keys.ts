export default function keys<E>(e): E[] {
  return Object.entries(e)
    .filter(([k]) => Number.isNaN(Number(k)))
    .map(([a]) => (a as unknown) as E) as E[];
}
