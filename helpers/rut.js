const getCleanedRun = (value) =>
  typeof value === "string"
    ? value.replace(/[^0-9kK]+/g, "").toUpperCase()
    : "";

const isValidRun = (value) => {
  const run = getCleanedRun(value);
  let runDigits = parseInt(run.slice(0, -1), 10);
  let m = 0;
  let s = 1;

  while (runDigits > 0) {
    s = (s + (runDigits % 10) * (9 - (m % 6))) % 11;
    runDigits = Math.floor(runDigits / 10);
    m += 1;
  }

  const checkDigit = s > 0 ? String(s - 1) : "K";
  return checkDigit === run.slice(-1);
};

const getFormattedRun = (value) => {
  const run = getCleanedRun(value);

  const formattedRun = () => {
    let result = `${run.slice(-4, -1)}-${run.substr(run.length - 1)}`;

    for (let i = 4; i < run.length; i += 3) {
      result = `${run.slice(-3 - i, -i)}.${result}`;
    }

    return result;
  };

  return run.length <= 1 ? run : formattedRun();
};

module.exports = { getFormattedRun, isValidRun, getCleanedRun };
