export const calculateAge = (birthDate) => {
  if (!birthDate) return '-';
  try {
    let birth;
    const today = new Date();
    if (typeof birthDate === 'string') {
      if (birthDate.includes('-')) {
        const [year, month, day] = birthDate.split('-');
        birth = new Date(year, month - 1, day);
      } else if (birthDate.includes('/')) {
        const [day, month, year] = birthDate.split('/');
        birth = new Date(year, month - 1, day);
      } else {
        birth = new Date(birthDate);
      }
    } else {
      birth = new Date(birthDate);
    }
    if (isNaN(birth.getTime())) return '-';
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    return age >= 0 ? `${age} años` : '-';
  } catch {
    return '-';
  }
};


