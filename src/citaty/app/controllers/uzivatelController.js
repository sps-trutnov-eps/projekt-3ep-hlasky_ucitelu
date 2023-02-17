const model = require('../models/uzivatelModel');
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');

const randBetween = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min;
}

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

exports.overeni = (req, res) => {
    res.render('uzivatel/overeni', {
        error: undefined,
    })
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

    //kód pro posílání emailů:

    const kod = randBetween(1000000, 9999999); //7-digit code pro ověření
    
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
        to: email,
        subject: "Nodemailer Test",
        text: "Váš ověřovací kód je: " + kod
     };
     
     transporter.sendMail(mailOptions, function(error, info){
        if(error){
           console.log(error);

           return response.render('uzivatel/registrace', {
            error: 'Email neexistuje!',
            });
        }else{
           console.log("Email sent: " + info.response);
        }
     });

    //konec kódu pro emaily

    //request.session.kod = bcrypt.hashSync(kod.toString(), 10); // doubble encryption
    request.session.kod = kod;

    request.session.uzivatel = [jmeno, email, bcrypt.hashSync(heslo, 10)];

    setTimeout(function(){
        request.session.expired = 1;
        console.log("KÓD EXPIRED");
    
    }, 0.125 * 60000); // za jak dlouho vyprší kód. (v minutách)

    return response.redirect('/uzivatel/overeni');
}

exports.overit = (request, response) => {
    const kod = request.body.kod;

    if (request.session.expired == 1){
        request.session.uzivatel = undefined;
        request.session.kod = undefined;
    }

    console.log("Overit expired: " + request.session.expired);
    console.log("Overit kod: " + request.session.kod);
    if (request.session.uzivatel == undefined || request.session.kod == undefined){
        return response.render("uzivatel/overeni", {
            error: "Kód vypršel!",
        });
    }

    if (request.session.kod != kod){
        return response.render("uzivatel/overeni", {
            error: "Špatný kód!",
        });
    }

    if(!model.pridatUzivatele(request.session.uzivatel[0], request.session.uzivatel[1], request.session.uzivatel[2])) {
        return response.redirect('/web/error');
    }

    request.session.uzivatel = undefined;
    request.session.kod = undefined;

    return response.redirect('/uzivatel/prihlaseni');

    // přidat uživatele do db
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
