const nextFunction = (currentPage) => () => {
  const fresh = require('./newfresh');
  const next = currentPage + 1;
  return fresh({ page: next });
};

const createNextFunction = (pagination) => {
  const { page } = pagination;
  return nextFunction(page);
};

module.exports = createNextFunction;
