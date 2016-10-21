"use strict"
const shortId = require('shortid');
const RSS = require('rss');

class User {
  constructor (chatId) {
    this.id = shortid.generate();
    this.chatId = chatId;
    this.rss = new RSS({ title: 'Gramovie'});
    this.sources = [];
  }

  addSource (feed) {
    if (this.sources.includes(feed)) return true;

    const sourcessRecognized = [{ regex: /yts.ag/, id: 'YTS' }];
    const sourceRecognized = sourcesRecognized.forEach((recognized) => source.match(recognized.regex));

    if (sourceRecognized) {
      this.sources.push(new Source(feed));
      return true;
    }

    return false;
  }

  get rssLink () { return `${process.env.URL}/rss/${this.id}`; }
}