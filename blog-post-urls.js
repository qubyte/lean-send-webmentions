'use strict';

const fetch = require('node-fetch');
const { join } = require('path');
const { readFile, writeFile } = require('fs').promises;
const cachedBlogPostUrlsPath = join(__dirname, '.data', 'blog-post-urls.json');
const { sitemapUrl, pagePattern } = require('./package.json');
const pageRegex = new RegExp(pagePattern);

async function fetchSitemap() {
  const res = await fetch(sitemapUrl);

  if (!res.ok) {
    throw new Error(`Unexpected status for ${sitemapUrl}`);
  }

  const content = await res.text();
  const urls = content.length ? content.trim().split('\n').map(line => line.trim()) : [];

  return urls.filter(url => pageRegex.test(url));
}

function save(blogPostUrls) {
  return writeFile(cachedBlogPostUrlsPath, JSON.stringify(blogPostUrls, null, 2));
};

async function load() {
  try {
    return JSON.parse(await readFile(cachedBlogPostUrlsPath, 'utf8'));
  } catch (e) {
    return [];
  }
}

exports.refresh = async function () {
  const previous = await load();
  const current = await fetchSitemap();

  console.log({previous, current, previouslen: previous.length, currentlen: current.length})

  await save(current);

  return current.filter(post => !previous.includes(post));
};

exports.init = async function () {
  await save(await fetchSitemap());
};
