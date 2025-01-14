const AWS = require("aws-sdk");

const { buildResponse } = require("../utils");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const { claims } = event.requestContext.authorizer.jwt;
    const { sub: userId, username } = claims;
    const { clicksCount } = JSON.parse(event.body);
    if (!clicksCount || typeof clicksCount !== "number") {
      return buildResponse(
        400,
        {
          "Access-Control-Allow-Origin": event.headers.origin,
        },
        { error: "Invalid clicksCount value" }
      );
    }

    const params = {
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
    };

    const result = await dynamoDb.update(params).promise();
    return buildResponse(
      200,
      {
        "Access-Control-Allow-Origin": event.headers.origin,
      },
      {
        message: "Clicks count incremented successfully",
        updatedAttributes: result.Attributes,
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return buildResponse(
      500,
      {
        "Access-Control-Allow-Origin": event.headers.origin,
      },
      { error: "Internal Server Error" }
    );
  }
};
