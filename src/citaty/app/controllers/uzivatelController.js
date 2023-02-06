const model = require('../models/uzivatelModel');

exports.registrace = (request, response) => {
    response.render('uzivatel/registrace', {
        hlaska: undefined,
        titulek: 'Registrace',
    });
}

exports.prihlaseni = (request, response) => {
    response.render('uzivatel/prihlaseni', {
        hlaska: undefined,
        titulek: 'Přihlášení',
    });
}

exports.registrovat = (request, response) => {
    const jmeno = request.body.jmeno.trim();
    const heslo = request.body.heslo.trim();
    const hesloZnovu = request.body.hesloZnovu.trim();

    if(jmeno.length == 0) {
        return response.render('uzivatel/registrace', {
            hlaska: 'Jméno není vyplněné!',
        });
    }
    if(heslo.length == 0) {
        return response.render('uzivatel/registrace', {
            hlaska: 'Heslo není vyplněné!',
        });
    }
    if(heslo != hesloZnovu) {
        return response.render('uzivatel/registrace', {
            hlaska: 'Hesla se neshodují!',
        });
    }
    if(model.existujeUzivatel(jmeno)) {
        return response.render('uzivatel/registrace', {
            hlaska: 'Uživatel již existuje!',
        });
    }

    if(!model.pridatUzivatele(jmeno, heslo)) {
        return response.redirect('/web/error');
    }

    return response.redirect('/uzivatel/prihlasit');
}

exports.prihlasit = (request, response) => {
    const jmeno = request.body.jmeno.trim();
    const heslo = request.body.heslo.trim();

    if(!model.existujeUzivatel(jmeno)) {
        return response.render('uzivatel/prihlaseni', {
            hlaska: 'Uživatel neexistuje!',
        });
    }

    if(!model.spravneHeslo(jmeno, heslo)) {
        return response.render('uzivatel/prihlaseni', {
            hlaska: 'Chybné heslo!',
        });
    }

    request.session.prihlasenyUzivatel = jmeno;

    return response.redirect('/uzivatel/profil');
}

exports.profil = (request, response) => {
    if(!request.session.prihlasenyUzivatel) {
        return response.redirect('/uzivatel/prihlasit');
    }

    response.render('uzivatel/profil', {
        jmeno: request.session.prihlasenyUzivatel,
        titulek: 'Profil',
    });
}

exports.odhlasit = (request, response) => {
    request.session.destroy();

    response.redirect('/web/index');
}
