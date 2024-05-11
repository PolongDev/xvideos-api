const base = require('../../base');
const parseResponse = require('./parseResponse');

const PATH = '/new/';

const newFresh = async ({ page = 1 } = {}) => {
  if (page < 1 || page > Number.MAX_SAFE_INTEGER) {
    throw new Error(`Invalid page: ${page}`);
  }
  try {
    const request = base.createRequest();
    const verificationPath = page > 1 ? `${PATH}${page}` : '';

    return parseResponse(page, await request.get(`${verificationPath}`));
  } catch (e) {
    console.log(e);
  }
};

module.exports = newFresh;
