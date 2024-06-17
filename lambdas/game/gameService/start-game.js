const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoClient } = require('../database');


const startGame = async (gameId) => {
  const params = {
    TableName: 'game-table',
    Key: { gameId },
    UpdateExpression: 'SET #s = :s',
    ExpressionAttributeNames: { '#s': 'status' },
    ExpressionAttributeValues: { ':s': 'started' },
  };

  try {
    await dynamoClient.send(new UpdateCommand(params));
    return { statusCode: 200, body: 'Game started successfully' };
  } catch (error) {
    console.error('Error starting game:', error);
    return { statusCode: 500, body: `Error starting game: ${error.message}` };
  }
};

module.exports = startGame;
