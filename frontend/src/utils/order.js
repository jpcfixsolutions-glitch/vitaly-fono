export const orderByName = (input) => {
  const items = Array.isArray(input) ? input : input?.data;
  if (!Array.isArray(items)) return items ?? [];
  return items.sort((a, b) => (a?.name || "").localeCompare(b?.name || ""));
}