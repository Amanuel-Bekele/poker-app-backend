const { decode } = require('./common/decoder');
const { createGame, addPlayer, updatePlayer, borrowChips, getGame, startGame, endGame } = require('./gameService');

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  let body = decode(event);

  console.log('Decoded event body:', JSON.stringify(body, null, 2));

  switch (body?.operation) {
    case 'create-game': {
      const { players } = body;
      return createGame(players);
    }
    case 'add-player': {
      const { gameId, player } = body;
      return addPlayer(gameId, player);
    }
    case 'update-player': {
      const { gameId, player } = body;
      return updatePlayer(gameId, player);
    }
    case 'borrow-chips': {
      return borrowChips(body);
    }
    case "get-game": {
      const { gameId } = body;
      return getGame(gameId);
    }
    case 'start-game': {
      const { gameId } = body;
      return startGame(gameId);
    }
    case 'end-game': {
      const { gameId } = body;
      return endGame(gameId);
    }
    default:
      return { statusCode: 400, body: 'Invalid operation' };
  }
};
