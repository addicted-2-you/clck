const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const claims = event.requestContext.authorizer.jwt.claims;
    const userId = claims.sub;

    const { clicksCount } = JSON.parse(event.body);
    if (!clicksCount || typeof clicksCount !== "number") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid clicksCount value" }),
      };
    }

    const params = {
      TableName: "clck-user-clicks",
      Key: { userId },
      UpdateExpression:
        "SET clicksCount = if_not_exists(clicksCount, :start) + :increment, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":increment": clicksCount,
        ":start": 0,
        ":updatedAt": new Date().toISOString(),
      },
      ReturnValues: "UPDATED_NEW",
    };

    const result = await dynamoDb.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Clicks count incremented successfully",
        updatedAttributes: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error processing request:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
