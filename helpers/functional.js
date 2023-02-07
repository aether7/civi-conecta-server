const doNothing = () => null;
const prop = (key) => obj => obj[key];

module.exports = { doNothing, prop };
