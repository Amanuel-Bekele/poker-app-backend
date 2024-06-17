const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoClient } = require('../database');

// Usage note:
// Will be used in async page to end the game.
const endGame = async (gameId) => {
  const params = {
    TableName: 'game-table',
    Key: { gameId },
    UpdateExpression: 'SET #s = :s',
    ExpressionAttributeNames: { '#s': 'status' },
    ExpressionAttributeValues: { ':s': 'ended' },
  };

  try {
    await dynamoClient.send(new UpdateCommand(params));
    return { statusCode: 200, body: 'Game ended successfully' };
  } catch (error) {
    console.error('Error ending game:', error);
    return { statusCode: 500, body: `Error starting game: ${error.message}` };
  }
};

module.exports = endGame;
