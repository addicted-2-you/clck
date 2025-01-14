const AWS = require("aws-sdk");

const { buildResponse } = require("../utils");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { claims } = event.requestContext.authorizer.jwt;
    const { sub: userId } = claims;

    const topUsersParams = {
      TableName: "clck-user-clicks",
      IndexName: "clicksCount-index",
      KeyConditionExpression: "dummy = :pk",
      ExpressionAttributeValues: {
        ":pk": "clicks",
      },
      ScanIndexForward: false,
      Limit: 10,
    };

    const topUsersResult = await dynamoDb.query(topUsersParams).promise();
    const topUsers = topUsersResult.Items;
    const currentUserIndex = topUsers.findIndex(
      (user) => user.userId === userId
    );
    let currentUser = topUsers[currentUserIndex];
    if (currentUser) {
      currentUser.position = currentUserIndex + 1;
    } else {
      const currentUserParams = {
        TableName: "clck-user-clicks",
        Key: { userId },
      };

      const currentUserResult = await dynamoDb.get(currentUserParams).promise();
      if (currentUserResult.Item) {
        currentUser = currentUserResult.Item;

        const higherRankedParams = {
          TableName: "clck-user-clicks",
          IndexName: "clicksCount-index",
          KeyConditionExpression: "dummy = :pk",
          FilterExpression: "clicksCount > :clicks",
          ExpressionAttributeValues: {
            ":pk": "clicks",
            ":clicks": currentUser.clicksCount || 0,
          },
        };

        const higherRankedResult = await dynamoDb
          .scan(higherRankedParams)
          .promise();
        const userRank = higherRankedResult.Count + 1;
        currentUser.position = userRank;
      } else {
        currentUser = null;
      }
    }

    return buildResponse(
      200,
      {
        "Access-Control-Allow-Origin": event.headers.origin,
      },
      {
        message: "Fetched top users successfully",
        topUsers: topUsers.map((tu, index) => ({ ...tu, position: index + 1 })),
        currentUser,
      }
    );
  } catch (error) {
    console.error("Error fetching top users:", error);

    return buildResponse(
      500,
      {
        "Access-Control-Allow-Origin": event.headers.origin,
      },
      { error: "Internal Server Error" }
    );
  }
};
