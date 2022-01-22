export const toFixed = (value = 0, precision = 2, percent = 1) => {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return 0;
  }
  if (num < Math.pow(-2, 31) || num > Math.pow(2, 31) - 1) {
    return 0;
  }
  let newNum = value * percent;
  // console.log(num, precision)
  if (precision < 0 || typeof precision !== 'number') {
    return newNum * percent;
  } else if (precision > 0) {
    newNum = Math.round(num * Math.pow(10, precision) * percent) / Math.pow(10, precision);
    return newNum;
  }
  newNum = Math.round(num);

  return newNum;
};

export const caculateEarnings = (money: number, price: number, currentPrice: number): number => {
  if (Number(currentPrice) > 0) {
    return (money / price) * currentPrice - money;
  } else {
    return 0;
  }
};