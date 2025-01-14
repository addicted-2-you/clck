const buildResponse = (statusCode, headers, body) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    ...headers,
  },
  body: JSON.stringify(body),
});

module.exports = {
  buildResponse,
};
