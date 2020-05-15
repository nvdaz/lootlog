export default function count(arr = []) {
  const data = [];

  arr.forEach((dragon) => {
    if (data.some(({ dragonType }) => dragon === dragonType))
      data.find(({ dragonType }) => dragon === dragonType).count += 1;
    else data.push({ dragonType: dragon, count: 1 });
  });

  return data;
}
