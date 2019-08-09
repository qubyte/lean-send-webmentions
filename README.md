# lean-send-webmentions

With the arrival of https://webmention.app, I decided to ditch my own
implementation While it was techically doing more (it was capable of 
rescanning old posts for new URLs to mention), most of the additional
functionality doesn't get used.

This project uses webmention.app in its module form to dispatch
webmentions. It caches copy of sitemap.txt to know when an entry is
added and to check it.

In [package.json](./package.json) two confiuration parameters can be
found:

 - `sitemapUrl` The URL for the sitemap.txt file.
 - `pagePattern` A regular expression to filter lines of the sitemap to a list of pages which should be searched for mentions.

The [.env](./.env) file contains a secret. This is a shared secret with
netlify to verify the authenticity of a webhook request.