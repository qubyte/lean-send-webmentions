'use strict';

const events = require('events');
const Webmention = require('@remy/webmention');
const blogPostUrls = require('./blog-post-urls');

async function dispatchWebmentionsForPost(url) {
  const wm = new Webmention({ limit: 0, send: true });

  wm.fetch(url);

  await events.once(wm, 'end');

  console.log('Dispatched:', wm.endpoints);
}

module.exports = async function dispatchMentions() {
  const toHandle = await blogPostUrls.refresh();

  console.log(`New blog entries to handle: ${toHandle.length}: ${JSON.stringify(toHandle, null, 2)}`);

  for (const url of toHandle) {
    try {
      await dispatchWebmentionsForPost(url);
    } catch (e) {
      console.error(`Error dispatching mentions for ${url}`, e.stack);
    }
  }
};
