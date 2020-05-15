export default function quantile(arr, q) {
  const sorted = arr.sort((a, b) => a - b);
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  return sorted[base + 1]
    ? sorted[base] + (pos - base) * (sorted[base + 1] - sorted[base])
    : sorted[base];
}
