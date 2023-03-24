const dateToMonthDay = (dateLike) => {
  const arr = dateLike.split(/[^0-9]/);
  const day = String(arr[arr.length - 1]).padStart(2, '0');
  const month = String(arr[arr.length - 2]).padStart(2, '0');
  return `${month}-${day}`;
};

module.exports = { dateToMonthDay };
