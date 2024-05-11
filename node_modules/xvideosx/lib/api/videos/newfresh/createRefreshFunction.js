const refreshFunction = (currentPage) => () => {
  const fresh = require('./newfresh');
  return fresh(currentPage);
};

const createRefreshFunction = (pagination) => {
  const { page } = pagination;
  return refreshFunction(page);
};

module.exports = createRefreshFunction;
