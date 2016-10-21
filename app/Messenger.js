"use strict"
const TelegramBot = require('node-telegram-bot-api');
const Source = require('./Source');

class Messenger {
  // We should extend a messenger for every bot
  static get token () { return { TELEGRAM: "299436853:AAFwxlFtsb1L8uUVS0Wu3jFPPJ-b2HBVmIM" }; }

  constructor () {
    this.bot = new TelegramBot(Messenger.token.TELEGRAM, { polling: true });
    this.users = [];
  }

  addUser (userId, chatId) {
    const user = this.users.find((user) => user.id === userId);
    
    if (user) {
      user.chatId = chatId;
      this.bot.sendMessage(user.chatId, 'Bienvenido nuevamente! ', { parse_mode: 'Markdown' });
      return;
    }

    const newUser = new User(chatId);
    this.users.push(newUser);

    const message = `Guarda este pin unico para identificarte: **${newUser.id}**
      Si llegas a cerrar nuestra conversación, puedes recuperar tu usuario enviandome **/start ${newUser.id}**
      Tu cuenta ya está funcionando. Agrega feeds con /add o espera a recibir noticias.
      Recuerda que hasta ahora solo funciono con YTS!`;

    this.bot.sendMessage(newUser.chatId, message, { parse_mode: 'Markdown' });
  }

  addSource (feed, chatId) {
    const user = this.users.find((user) => user.chatId === chatId);

    if (!user) {
      this.bot.sendMessage(user.chatId, 'Para empezar a agregar feeds debes inicializar con /start o /start *ID* ', { parse_mode: 'Markdown' });
      return;
    }
    this.bot.sendMessage(user.chatId, user.addSource(feed) ? 'El feed se agregó con éxito!' : 'Todavía no reconocemos ese feed :(', { parse_mode: 'Markdown' });
  }

  sendMovies (user) {
    user.sources.forEach((source) => {
      let movie;
      do {
        movie = source.inform();
        if (movie) {
          const downloadButton = JSON.stringify({ inline_keyboard: [{ text: 'Descargar', callback_data: movie.title }]});
          this.bot.sendPhoto(user.chatId, movie.image, { caption: movie.toString(),
                                                         reply_markup: downloadButton });
        }
      } while(movie);
    });
  }

  receive (msg) {
    const options = {
      start: (id) => this.addUser(id, msg.chat.id),
      add: (feed) => this.addSource(feed, msg.chat.id)
    }

    debugger;

    this.chatId = msg.chat.id;
    const title = msg.text.split(':')[0];
    if (!title) return;
   
    let movie;
    this.sources.find((source) => movie = movie || source.findMovie(title))
    if (movie) this.rss.item(movie.rss);
  }

  receiveQuery (msg) {
    msg;
    debugger;
  }

  listen () {
    // Automatic fetching
    const sendMessages = () => {
      this.users.forEach((user) => {
        Promise.all(user.sources.map((source) => source.fetch()))
          .then(() => this.sendMovies(user));
      })
    }

    setInterval(sendMessages, 1000 * 60 * 1); // 30 mins
    this.bot.on('text', this.receiveText.bind(this));
    this.bot.on('callback_query', this.receiveQuery.bind(this));
  }
}

module.exports = Messenger