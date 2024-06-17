const { GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { dynamoClient } = require('../database');

const getPlayerIndex = (players, name) =>
  players.findIndex((player) => player.name === name);

// Usage note:
// This function is meant to be for updating player chips, borrowing from bank.
// If done on start of the game, new chips coming will be deducted from zero.
// If done mid-game, new chips coming will be deducted from current chips.
const updatePlayer = async (gameId, player) => {
  //  1: Retrieve players from given gameId
  const { name, chips = 0 } = player;

  const getPlayerParams = {
    TableName: 'game-table',
    Key: { gameId },
    ProjectionExpression: 'players',
  };

  try {
    const gameData = await dynamoClient.send(new GetCommand(getPlayerParams));
    const players = gameData.Item.players || [];

    // 2: Find the player index by name
    const playerIndex = getPlayerIndex(players, name);

    // 3. Calculate new chips
    const currentChips = players[playerIndex].chips;
    const newChips = currentChips - chips;

    if (playerIndex === -1) {
      return { statusCode: 404, body: 'Player not found' };
    }

    // 4: Update player chips
    const updateParams = {
      TableName: 'game-table',
      Key: { gameId },
      UpdateExpression: `SET players[${playerIndex}].chips = :newChips`,
      ExpressionAttributeValues: {
        ':newChips': newChips,
      },
    };

    await dynamoClient.send(new UpdateCommand(updateParams));
    return { statusCode: 200, body: 'Player updated successfully' };
  } catch (error) {
    console.error('Error updating player:', error);
    return { statusCode: 500, body: `Error updating player: ${error.message}` };
  }
};

module.exports = updatePlayer;
