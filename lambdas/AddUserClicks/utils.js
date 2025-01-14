const buildUpdateClicksParams = ({ userId, clicksCount, username }) => ({
  TableName: "clck-user-clicks",
  Key: { userId },
  UpdateExpression:
    "SET clicksCount = if_not_exists(clicksCount, :start) + :increment, username = :username, dummy = :dummy, updatedAt = :updatedAt",
  ExpressionAttributeValues: {
    ":increment": clicksCount,
    ":start": 0,
    ":updatedAt": new Date().toISOString(),
    ":username": username,
    ":dummy": "clicks",
  },
  ReturnValues: "UPDATED_NEW",
});

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
  buildUpdateClicksParams,
  buildResponse,
};
