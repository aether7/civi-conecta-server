const dateToMonthDay = (dateLike) => {
  let [_, month, day] = dateLike.split(/[^0-9]/)
  day = String(day).padStart(2, '0');
  month = String(month).padStart(2, '0');
  return `${month}-${day}`;
};

module.exports = { dateToMonthDay };
