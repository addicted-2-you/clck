const buildTopUsersParams = () => ({
  TableName: "clck-user-clicks",
  IndexName: "clicksCount-index",
  KeyConditionExpression: "dummy = :pk",
  ExpressionAttributeValues: {
    ":pk": "clicks",
  },
  ScanIndexForward: false,
  Limit: 10,
});

const buildCurrentUserParams = ({ userId }) => ({
  TableName: "clck-user-clicks",
  Key: { userId },
});

const buildHigherRankedParams = ({ clicksCount }) => ({
  TableName: "clck-user-clicks",
  IndexName: "clicksCount-index",
  KeyConditionExpression: "dummy = :pk",
  FilterExpression: "clicksCount > :clicks",
  ExpressionAttributeValues: {
    ":pk": "clicks",
    ":clicks": clicksCount,
  },
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
  buildTopUsersParams,
  buildCurrentUserParams,
  buildHigherRankedParams,
  buildResponse,
};
