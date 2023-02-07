const session = require('express-session');
const express = require('express');
const app = express();

// jaky templatovaci jazyk pouzivam
app.set('view engine', 'ejs');
// kde se nachazeji moje views
app.set('views', './app/views');

// middle-ware pro praic se session
app.use(session({
    secret: require('../conf').secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

// middle-ware pro zprac. dat z formulare
app.use(express.urlencoded({ extended: false }));

// slozka se statickymi soubory (CSS, JS, obrazky, atd.)
app.use(express.static('./www'));

// reakce na URL /hello
app.get('/hello', (req, res) => res.send('Hello World!'));
// reakce na URL /json
app.get('/json', (req, res) => res.json({pozdrav: 'Hello World'}));

// vlastni middleware
app.use('/web', require('./routers/webRouter'));
// obsluha uzivatelu
app.use('/uzivatel', require('./routers/uzivatelRouter'));
// obslua hlasek
app.use('/hlasky', require('./routers/hlaskyRouter'));

// nastaveni defaultniho view
app.get('/', (req, res) => res.redirect('/web/index'));
// sber vsech ostatnich URL -> chybovy view
app.get('*', (req, res) => res.redirect('/web/error'));

module.exports = app;
