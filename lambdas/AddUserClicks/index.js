const AWS = require("aws-sdk");

const { buildUpdateClicksParams, buildResponse } = require("./utils");

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

    const params = buildUpdateClicksParams({ userId, clicksCount, username });
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
