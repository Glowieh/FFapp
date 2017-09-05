module.exports = function roll(dice, dieSize) {
  let result = 0;

  for(let i=0; i<dice; i++) {
    result += Math.floor((Math.random() * dieSize) + 1);
  }

  return result;
}
