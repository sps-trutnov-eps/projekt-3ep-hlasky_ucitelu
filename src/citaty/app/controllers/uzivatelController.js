const model = require('../models/uzivatelModel');

exports.registrace = (req, response) => {
    response.render('uzivatel/registrace', {
        error: undefined,
        jmeno: req.session.prihlasenyUzivatel || undefined,
        //titulek: 'Registrace',
    });
}

exports.prihlaseni = (req, response) => {
    response.render('uzivatel/prihlaseni', {
        error: undefined,
        jmeno: req.session.prihlasenyUzivatel || undefined,
        //titulek: 'Přihlášení',
    });
}

exports.registrovat = (req, response) => {
    const jmeno = req.body.jmeno.trim();
    const heslo = req.body.heslo.trim();
    const hesloZnovu = req.body.hesloZnovu.trim();

    if(jmeno.length == 0) {
        return response.render('uzivatel/registrace', {
            error: 'Jméno není vyplněné!',
            jmeno: req.session.prihlasenyUzivatel || undefined,
        });
    }
    if(heslo.length == 0) {
        return response.render('uzivatel/registrace', {
            error: 'Heslo není vyplněné!',
            jmeno: req.session.prihlasenyUzivatel || undefined,
        });
    }
    if(heslo != hesloZnovu) {
        return response.render('uzivatel/registrace', {
            error: 'Hesla se neshodují!',
            jmeno: req.session.prihlasenyUzivatel || undefined,
        });
    }
    if(model.existujeUzivatel(jmeno)) {
        return response.render('uzivatel/registrace', {
            error: 'Uživatel již existuje!',
            jmeno: req.session.prihlasenyUzivatel || undefined,
        });
    }

    if(!model.pridatUzivatele(jmeno, heslo)) {
        return response.redirect('/web/error');
    }

    return response.redirect('/uzivatel/prihlasit');
}

exports.prihlasit = (req, response) => {
    const jmeno = req.body.jmeno.trim();
    const heslo = req.body.heslo.trim();

    if(!model.existujeUzivatel(jmeno)) {
        return response.render('uzivatel/prihlaseni', {
            error: 'Uživatel neexistuje!',
            jmeno: req.session.prihlasenyUzivatel || undefined,
        });
    }

    if(!model.spravneHeslo(jmeno, heslo)) {
        return response.render('uzivatel/prihlaseni', {
            error: 'Chybné heslo!',
            jmeno: req.session.prihlasenyUzivatel || undefined,
        });
    }

    req.session.prihlasenyUzivatel = jmeno;

    return response.redirect('/uzivatel/profil');
}

exports.profil = (req, response) => {
    if(!req.session.prihlasenyUzivatel) {
        return response.redirect('/uzivatel/prihlasit');
    }

    response.render('uzivatel/profil', {
        jmeno: req.session.prihlasenyUzivatel,
        jmeno: req.session.prihlasenyUzivatel || undefined,
        //titulek: 'Profil',
    });
}

exports.odhlasit = (req, response) => {
    req.session.destroy();

    response.redirect('/web/index');
}
