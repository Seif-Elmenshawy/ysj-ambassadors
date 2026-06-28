export const generateReferralCode = (count) => {
  const num = String(count + 1).padStart(3, '0');
  return `YSJ-${num}`;
};
