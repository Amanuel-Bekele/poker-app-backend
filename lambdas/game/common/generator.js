const generateGameId = () => {
    return Math.random().toString(16).substring(2, 7);
};

module.exports = { generateGameId };