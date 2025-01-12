const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { claims } = event.requestContext.authorizer.jwt;
    const { sub: userId, username } = claims;

    const { clicksCount } = JSON.parse(event.body);
    if (!clicksCount || typeof clicksCount !== "number") {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": event.headers.origin,
          "Access-Control-Allow-Credentials": true,
          "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type,Authorization",
        },
        body: JSON.stringify({ error: "Invalid clicksCount value" }),
      };
    }

    const params = {
      TableName: "clck-user-clicks",
      Key: { userId },
      UpdateExpression:
        "SET clicksCount = if_not_exists(clicksCount, :start) + :increment, username = :username, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":increment": clicksCount,
        ":start": 0,
        ":updatedAt": new Date().toISOString(),
        ":username": username,
      },
      ReturnValues: "UPDATED_NEW",
    };

    const result = await dynamoDb.update(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": event.headers.origin,
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Methods": "GET,PUT,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
      },
      body: JSON.stringify({
        message: "Clicks count incremented successfully",
        updatedAttributes: result.Attributes,
      }),
    };
  } catch (error) {
    console.error("Error processing request:", error);

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
