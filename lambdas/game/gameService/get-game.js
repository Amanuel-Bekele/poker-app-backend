const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoClient } = require('../database');

// Usage note:
// This function retrieves a game item from game-table.
// Could be used to display the sync page of the app, displaying all players and their chips.
const getGame = async (gameId) => {
  const params = {
    TableName: 'game-table',
    Key: { gameId },
  };

  try {
    const result = await dynamoClient.send(new GetCommand(params));
    return { statusCode: 200, body: JSON.stringify(result.Item) };
  } catch (error) {
    console.error('Error getting game:', error);
    throw new Error(`Error getting game: ${error.message}`);
  }
};

module.exports = getGame;
