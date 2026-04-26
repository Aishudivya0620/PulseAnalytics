export const engagementData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
    { name: 'Jul', value: 7000 },
];

export const platformData = [
    { name: 'Instagram', value: 4000 },
    { name: 'Twitter', value: 3000 },
    { name: 'LinkedIn', value: 2000 },
    { name: 'Facebook', value: 2780 },
];

export const audienceData = [
    { name: '18-24', value: 400 },
    { name: '25-34', value: 300 },
    { name: '35-44', value: 300 },
    { name: '45+', value: 200 },
];

export const kpistats = {
    followers: 280500,
    rate: 5.8,
    posts: 1482,
    reach: 1200000

}


// format number to k and M
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num;
};