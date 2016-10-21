"use strict"; 
const Messenger = require('./Messenger');
const express = require('express');
const app = express();
const main = new Messenger();

app.listen(process.env.PORT || 3000);
app.get('/', (req, res) => res.send("Piracy is illegal"));
app.get('/rss/:userId', (req, res) => {
  const user = main.users.find((user) => user.id === +userId);
  if (!user) res.status(404).send('No existe ese feed :(');
  res.send(user.rss.xml({ indent: true }))
});

// Program execution
(() => main.listen())();