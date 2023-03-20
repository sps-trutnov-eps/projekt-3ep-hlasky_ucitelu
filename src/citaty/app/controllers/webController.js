exports.about = (req, res) => {
    res.render('web/about', {
        titulek: 'O aplikaci',
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
    });
}

exports.error = (req, res)=> {
    res.render('web/error', {
        titulek: 'Chyba',
        chyba: 'Nastala chyba.',
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
    });
}

exports.index = (req, res)=> {
    res.render('web/index', {
        titulek: 'Cvičná aplikace',
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
    });
}
