const base = require("../../base");
const parseResponse = require('./parseResponse')

const details = async ({url = ''} = {}) => {
  try {
    const request = base.createRequest();
    return parseResponse(await request.get(url))

  } catch (error) {
    throw new Error(error)
  }
};

module.exports = details;
