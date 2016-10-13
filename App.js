"use strict"; 
const Messenger = require('./Messenger');
const app = express();

app.listen(process.env.PORT || 3000);
app.get('/', (req, res) => res.send("Piracy is illegal"));

// Program execution
(() => new Messenger().listen())();