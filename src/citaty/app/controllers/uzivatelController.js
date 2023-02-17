const model = require('../models/uzivatelModel');
const nodemailer = require("nodemailer");

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
    const email = request.body.email.trim();
    const heslo = request.body.heslo.trim();
    const hesloZnovu = request.body.hesloZnovu.trim();

    if (email.length == 0){
        return response.render('uzivatel/registrace', {
            error: 'Email není vyplněný!',
        });
    }

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

    if (!email.includes("@spstrutnov.cz")){
        return response.render('uzivatel/registrace', {
            error: 'Email není školní email!',
        });
    }

    if(model.existujeUzivatel(jmeno)) {
        return response.render('uzivatel/registrace', {
            error: 'Uživatel již existuje!',
        });
    }

    if(!model.pridatUzivatele(jmeno, email, heslo)) {
        return response.redirect('/web/error');
    }

    //kód pro posílání emailů:

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
           user: "hlaskyspstrutnov@gmail.com",
           pass: "fkmavpsvlubwpuxu"
        },
        tls:{rejectUnauthorized: false}
     });
     
     const mailOptions = {
        from: "hlaskyspstrutnov@gmail.com",
        to: "furlong@spstrutnov.cz",
        subject: "Nodemailer Test",
        html: "Test Gmail using Node JS"
     };
     
     transporter.sendMail(mailOptions, function(error, info){
        if(error){
           console.log(error);
        }else{
           console.log("Email sent: " + info.response);
        }
     });

    //konec kódu pro emaily

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
        highScore: model.getHighScore(request.session.prihlasenyUzivatel),
    });
}

exports.odhlasit = (request, response) => {
    request.session.destroy();
    response.redirect('/web/index');
}
