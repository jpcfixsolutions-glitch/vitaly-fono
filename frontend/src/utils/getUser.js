export const getUser = () => {
  const rawUser = localStorage.getItem('user');
  const parsed = rawUser ? JSON.parse(rawUser) : null;
  return parsed;
}