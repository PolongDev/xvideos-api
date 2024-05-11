const previousFunction = (currentPage) => () => {
  const fresh = require('./newfresh');
  const previous = currentPage - 1;
  return fresh({ page: previous });
};

const createPreviousFunction = (pagination) => {
  const { page } = pagination;
  return previousFunction(page);
};

module.exports = createPreviousFunction;
