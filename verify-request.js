'use strict';

const verify = require('util').promisify(require('jsonwebtoken').verify);
const crypto = require('crypto');

module.exports = async function verifyRequest(signature, body) {
  const decoded = await verify(signature, process.env.SECRET, { issuer: 'netlify' });

  const hash = decoded.sha256;
  const generated = crypto.createHash('sha256').update(body).digest('hex');

  if (hash !== generated) {
    throw new Error('Hash mismatch.');
  }
};
