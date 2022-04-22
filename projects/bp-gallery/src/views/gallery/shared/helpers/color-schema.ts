const getColorSchema = (from: string, dark = false) => {
  let hash = 0;
  for (let i = 0; i < from.length; i++) {
    hash = from.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${(hash % 90) - 45}deg, 40%, 50%)`;
  return color;
};

export default getColorSchema;
