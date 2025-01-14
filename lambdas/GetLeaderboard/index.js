const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  QueryCommand,
  GetCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const {
  buildTopUsersParams,
  buildCurrentUserParams,
  buildHigherRankedParams,
  buildResponse,
} = require("./utils");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
  try {
    const { claims } = event.requestContext.authorizer.jwt;
    const { sub: userId } = claims;

    const topUsersParams = buildTopUsersParams();
    const topUsersResult = await dynamoDb.send(
      new QueryCommand(topUsersParams)
    );
    const topUsers = topUsersResult.Items;
    const currentUserIndex = topUsers.findIndex(
      (user) => user.userId === userId
    );
    let currentUser = topUsers[currentUserIndex];
    if (currentUser) {
      currentUser.position = currentUserIndex + 1;
    } else {
      const currentUserParams = buildCurrentUserParams({ userId });
      const currentUserResult = await dynamoDb.send(
        new GetCommand(currentUserParams)
      );
      if (currentUserResult.Item) {
        currentUser = currentUserResult.Item;

        const higherRankedParams = buildHigherRankedParams({
          clicksCount: currentUser.clicksCount || 0,
        });

        const higherRankedResult = await dynamoDb.send(
          new ScanCommand(higherRankedParams)
        );
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
