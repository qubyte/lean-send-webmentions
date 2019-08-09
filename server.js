'use strict';

const express = require('express');
const verifyRequest = require('./verify-request');
const dispatchMentions = require('./dispatch-mentions');

const app = express();

app.get('/', (_req, res) => res.send('Hello, world!'));

app.post('/webhook', async (req, res) => {
  console.log('POST /webhook received request.');

  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks);

  try {
    await verifyRequest(req.headers['x-webhook-signature'] || '', body);
  } catch (e) {
    console.error('Verification error:', e);
    return res.sendStatus(401);
  }

  let data;

  try {
    data = JSON.parse(body.toString());
  } catch (e) {
    console.error('Unable to parse body as JSON.', body.toString());
    return res.sendStatus(400);
  }

  // Only dispatch webmentions for production deploys.
  if (data.context !== 'production') {
    console.log('Not a production deploy:', data.context);
    return res.sendStatus(200);
  }

  // No need to hold up the webhook response.
  res.sendStatus(202);

  try {
    await dispatchMentions();
  } catch (error) {
    console.error('Error dispatching mentions.', error);
  }
});

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}.`));
