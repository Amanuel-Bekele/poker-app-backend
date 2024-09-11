const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { TransactWriteCommand } = require('@aws-sdk/lib-dynamodb');

const { dynamoClient } = require('../database');

const borrowChips = async (borrowChipsEvent) => {
  const { gameId, lenderName, borrowerName, chips } = borrowChipsEvent;

  try {
    // 1. Retrieve the game data to find the players
    const getPlayerParams = {
      TableName: 'game-table',
      Key: { gameId },
      ProjectionExpression: 'players',
    };

    const gameData = await dynamoClient.send(new GetCommand(getPlayerParams));
    const players = gameData.Item.players || [];

    const lenderIndex = players.findIndex(
      (player) => player.name === lenderName
    );
    const borrowerIndex = players.findIndex(
      (player) => player.name === borrowerName
    );

    if (lenderIndex === -1 || borrowerIndex === -1) {
      return { statusCode: 404, body: 'Lender or borrower not found' };
    }

    const lender = players[lenderIndex];

    // 2. Check if lender has enough chips
    if (lender.chips < chips) {
      return { statusCode: 400, body: 'Lender does not have enough chips' };
    }

    // 1. Execute lend and borrow in a transaction
    const transactParams = {
      TransactItems: [
        {
          Update: {
            TableName: 'game-table',
            Key: { gameId },
            UpdateExpression: `
            SET players[${lenderIndex}].chips = players[${lenderIndex}].chips + :chips,
            players[${borrowerIndex}].chips = players[${borrowerIndex}].chips - :chips
            `,
            ConditionExpression: `players[${lenderIndex}].chips >= :chips`,
            ExpressionAttributeValues: { ':chips': chips },
          },
        },
      ],
    };

    // 2. Execute transaction
    await dynamoClient.send(new TransactWriteCommand(transactParams));
    return { statusCode: 200, body: 'Chips borrowed successfully' };
  } catch (error) {
    if (error.name === 'TransactionCanceledException') {
      console.error('Transaction failed:', error);
      return {
        statusCode: 400,
        body: 'Transaction failed. Possible reasons: lender does not have enough chips or concurrent update conflict.',
      };
    }
    console.error('Error borrowing chips:', error);
    return { statusCode: 500, body: `Error borrowing chips: ${error.message}` };
  }
};

module.exports = borrowChips;
