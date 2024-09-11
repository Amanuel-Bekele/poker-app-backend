const { generateGameId } = require('../common/generator');
const { dynamoClient } = require('../database');
const { PutCommand } = require('@aws-sdk/lib-dynamodb');

// Usage note:
// This function creates a new game item in game-table.
// Would be used when create new game is clicked. Would create a new game with empty players array.
const createGame = async (players = []) => {
  const gameId = generateGameId();

  const params = {
    TableName: 'game-table',
    Item: { gameId, players },
    status: 'created',
  };

  try {
    await dynamoClient.send(new PutCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ gameId }),
    };
  } catch (error) {
    console.error('Error creating game:', error);
    throw new Error(`Error creating game: ${error.message}`);
  }
};

module.exports = createGame;
