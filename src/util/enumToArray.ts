export default function enumToArray<T>(e): T[] {
  return Object.keys(e)
    .filter((t) => typeof e[t] === 'number')
    .map((t) => (t as unknown) as T);
}
