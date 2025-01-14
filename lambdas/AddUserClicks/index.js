const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");

const { buildUpdateClicksParams, buildResponse } = require("./utils");

const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

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
    const result = await dynamoDb.send(new UpdateCommand(params));
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
