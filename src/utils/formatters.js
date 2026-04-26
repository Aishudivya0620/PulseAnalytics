export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatPercentage = (num) => {
  if (num === undefined || num === null) return '0%';
  return `${num > 0 ? '+' : ''}${num}%`;
};
