export default new Promise((resolve) => {
  const image = new Image();
  image.onerror = () => resolve(false);
  image.onload = () => resolve(image.width === 1);
  image.src =
    'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
}).catch(() => false);
