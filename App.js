"use strict"; 
const Messenger = require('./Messenger');
const app = express();
const main = new Messenger();


app.listen(process.env.PORT || 3000);
app.get('/', (req, res) => res.send("Piracy is illegal"));
app.get('/rss', (req, res) => res.send(main.rss.xml({ indent: true })));

// Program execution
(() => main.listen())();