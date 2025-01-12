const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { claims } = event.requestContext.authorizer.jwt;
    const { sub: userId } = claims;

    const topUsersParams = {
      TableName: "clck-user-clicks",
      ScanIndexForward: false,
      Limit: 10,
    };

    const topUsersResult = await dynamoDb.scan(topUsersParams).promise();
    const topUsers = topUsersResult.Items;
    let currentUser = topUsers.find((user) => user.userId === userId);
    if (!currentUser) {
      const currentUserParams = {
        TableName: "clck-user-clicks",
        Key: { userId },
      };

      const currentUserResult = await dynamoDb.get(currentUserParams).promise();
      if (currentUserResult.Item) {
        currentUser = currentUserResult.Item;
      }
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": event.headers.origin,
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
      body: JSON.stringify({
        message: "Fetched top users successfully",
        topUsers,
        currentUser,
      }),
    };
  } catch (error) {
    console.error("Error fetching top users:", error);

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": event.headers.origin,
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
