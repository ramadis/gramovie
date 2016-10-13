"use strict"
const RSS = require('rss');
const TelegramBot = require('node-telegram-bot-api');
const Source = require('./Source');

class Messenger {
  // We should extend a messenger for every bot
  static get tokens () { return { TELEGRAM: process.env.TELEGRAM_TOKEN }; }
  static get feeds () { return { YTS: process.env.YTS_FEED }; }

  constructor () {
    this.bot = new TelegramBot(Messenger.tokens.TELEGRAM, { polling: true });
    this.sources = [new Source(process.env.YTS_FEED)];
    this.rss = new RSS({ title: 'Gramovie'});
  }

  sendMovies (user) {
    this.sources.forEach((source) => {
      let movie;
      do {
        movie = source.inform();
        if (movie) this.bot.sendMessage(user, movie);
      } while(movie);
    });
  }

  receive (msg) {
    const title = msg.split('\n')[0];
    if (!title) return;
   
    let movie;
    this.sources.find((source) => movie = movie || source.findMovie(title))
    this.rss.item(movie.rss);
  }

  listen () {
    // Automatic fetching
    setInterval(() => {
      this.sources.forEach((source) => source.fetch())
    }, 1000 * 60 * 30); // 30 mins

    this.bot.on('text', this.receive);
  }
}