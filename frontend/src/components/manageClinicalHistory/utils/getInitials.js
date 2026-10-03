export const getInitials = (patient) => {
  const firstName = (patient.name ?? '').trim();
  const lastName = (patient.last_name ?? '').trim();

  const firstInitial = firstName ? firstName[0] : '';
  const lastInitial = lastName ? lastName[0] : '';

  const initials = `${firstInitial}${lastInitial}`.toUpperCase();
  return initials || '?';
};