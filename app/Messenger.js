"use strict"
const RSS = require('rss');
const TelegramBot = require('node-telegram-bot-api');
const Source = require('./Source');

class Messenger {
  // We should extend a messenger for every bot
  static get tokens () { return { TELEGRAM: "299436853:AAFwxlFtsb1L8uUVS0Wu3jFPPJ-b2HBVmIM" }; }
  static get feeds () { return { YTS: "https://yts.ag/rss/0/720p/all/0" }; }

  constructor () {
    this.bot = new TelegramBot(Messenger.tokens.TELEGRAM, { polling: true });
    this.sources = [new Source(Messenger.feeds.YTS)];
    this.rss = new RSS({ title: 'Gramovie'});
  }

  sendMovies () {
    this.sources.forEach((source) => {
      let movie;
      do {
        movie = source.inform();
        if (movie) this.bot.sendPhoto(this.chatId, movie.image, { caption: movie.toString() });
      } while(movie);
    });
  }

  receive (msg) {
    this.chatId = msg.chat.id;
    const title = msg.text.split('\n')[0];
    if (!title) return;
   
    let movie;
    this.sources.find((source) => movie = movie || source.findMovie(title))
    if (movie) this.rss.item(movie.rss);
  }

  listen () {
    // Automatic fetching
    const sendMessages = () => {
      Promise.all(this.sources.map((source) => source.fetch()))
        .then(() => this.sendMovies());
    }

//    sendMessages();
    setInterval(sendMessages, 1000 * 60 * 2); // 30 mins

    this.bot.on('text', this.receive.bind(this));
  }
}

module.exports = Messenger