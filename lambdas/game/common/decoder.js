const decode = (event) => {
  let body;
  if (event?.isBase64Encoded) {
    body = JSON.parse(Buffer.from(event?.body, 'base64').toString('utf8'));
  } else {
    body = JSON.parse(event?.body);
  }

  return body;
};

module.exports = { decode };
