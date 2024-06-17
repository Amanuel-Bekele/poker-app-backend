const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoClient } = require('../database');

// Usage note:
// each player will have a name that will have hashed with the gameId and used in secondary index
const addPlayer = async (gameId, player) => {
  const { name, chips = 0 } = player;

  const params = {
    TableName: 'game-table',
    Key: { gameId },
    UpdateExpression:
      'SET players = list_append(if_not_exists(players, :empty_list), :p)',
    ExpressionAttributeValues: {
      ':p': [{ name, chips }],
      ':empty_list': [],
    },
  };
  console.log('Adding player:', JSON.stringify(params));
  try {
    await dynamoClient.send(new UpdateCommand(params));
    return { statusCode: 200, body: 'Player added successfully' };
  } catch (error) {
    console.error('Error adding player:', error);
    throw new Error(`Error adding player: ${error.message}`);
  }
};

module.exports = addPlayer;
