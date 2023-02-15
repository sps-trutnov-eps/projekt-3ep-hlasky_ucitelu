const model = require('../models/uzivatelModel');

exports.registrace = (request, response) => {
    response.render('uzivatel/registrace', {
        error: undefined,
        //titulek: 'Registrace',
    });
}

exports.prihlaseni = (request, response) => {
    response.render('uzivatel/prihlaseni', {
        error: undefined,
        //titulek: 'Přihlášení',
    });
}

exports.registrovat = (request, response) => {
    const jmeno = request.body.jmeno.trim();
    const heslo = request.body.heslo.trim();
    const hesloZnovu = request.body.hesloZnovu.trim();

    if(jmeno.length == 0) {
        return response.render('uzivatel/registrace', {
            error: 'Jméno není vyplněné!',
        });
    }
    if(heslo.length == 0) {
        return response.render('uzivatel/registrace', {
            error: 'Heslo není vyplněné!',
        });
    }
    if(heslo != hesloZnovu) {
        return response.render('uzivatel/registrace', {
            error: 'Hesla se neshodují!',
        });
    }
    if(model.existujeUzivatel(jmeno)) {
        return response.render('uzivatel/registrace', {
            error: 'Uživatel již existuje!',
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
            error: 'Uživatel neexistuje!',
        });
    }

    if(!model.spravneHeslo(jmeno, heslo)) {
        return response.render('uzivatel/prihlaseni', {
            error: 'Chybné heslo!',
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
        hlasky: model.getOblibenyHlasky(request.session.prihlasenyUzivatel),
        //titulek: 'Profil',
    });
}

exports.odhlasit = (request, response) => {
    request.session.destroy();
    response.redirect('/web/index');
}
