export const formatPricePKR = (usdPrice: number) => {
  const conversionRate = 278; // You can adjust this daily rate
  const pkrPrice = usdPrice * conversionRate;
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
  }).format(pkrPrice);
};