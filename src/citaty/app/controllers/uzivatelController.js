const model = require('../models/uzivatelModel');
const nodemailer = require("nodemailer");
const bcrypt = require('bcryptjs');

const randBetween = (min, max) => {
	return Math.round(Math.random() * (max - min)) + min;
}

function addMinutes(date, minutes) {
    return new Date(date + minutes*60000);
}

exports.registrace = (req, response) => {
    response.render('uzivatel/registrace', {
        error: undefined,
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        //titulek: 'Registrace',undefined
    });
}

exports.prihlaseni = (req, response) => {
    response.render('uzivatel/prihlaseni', {
        error: undefined,
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
    });
}

exports.overeni = (req, res) => {
    if (req.session.kod == undefined || req.session.uzivatel == "Přihlásit se"){
        return res.redirect('/web/error');
    }

    res.render('uzivatel/overeni', {
        error: undefined,
        time: req.session.uzivatel[3],
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se"
    })
}

exports.registrovat = (req, response) => {
    const jmeno = req.body.jmeno.trim();
    const email = req.body.email.trim();
    const heslo = req.body.heslo.trim();
    const hesloZnovu = req.body.hesloZnovu.trim();

    if (email.length == 0){
        return response.render('uzivatel/registrace', {
            error: 'Email není vyplněný!',
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        });
    }

    if(jmeno.length == 0) {
        return response.render('uzivatel/registrace', {
            error: 'Jméno není vyplněné!',
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        });
    }
    if(heslo.length == 0) {
        return response.render('uzivatel/registrace', {
            error: 'Heslo není vyplněné!',
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        });
    }

    if(heslo != hesloZnovu) {
        return response.render('uzivatel/registrace', {
            error: 'Hesla se neshodují!',
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        });
    }

    if (!email.endsWith("@spstrutnov.cz")){
        return response.render('uzivatel/registrace', {
            error: 'Email není školní email!',
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        });
    }

    if (model.existujeEmail(email)){
        return response.render('uzivatel/registrace', {
            error: 'Email už někdo používá!',
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        });
    }

    if(model.existujeUzivatel(jmeno)) {
        return response.render('uzivatel/registrace', {
            error: 'Uživatel již existuje!',
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
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
        subject: "Ověřovací kód",
        text: "Váš ověřovací kód je: " + kod
     };
     
     transporter.sendMail(mailOptions, function(error, info){
        if(error){
           console.log(error);

           return response.render('uzivatel/registrace', {
            error: 'Email neexistuje!',
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
            });
        }else{
           console.log("Email sent: " + info.response);
        }
    });

    //konec kódu pro emaily

    //req.session.kod = bcrypt.hashSync(kod.toString(), 10); // doubble encryption
    req.session.kod = kod;

    req.session.uzivatel = [jmeno, email, bcrypt.hashSync(heslo, 10), addMinutes(Date.now(), 1).toTimeString("HH:MM:SS")];
    console.log(req.session.uzivatel[3]);
    console.log(addMinutes(Date.now(), 1));

    setTimeout(function(){
        if (req.session.prihlasenyUzivatel == undefined){
            req.session.destroy();
            console.log("KÓD DESTROYED 1");
        }
        else{
            if (req.session.prihlasenyUzivatel != req.session.uzivatel[0]){
                req.session.destroy();
                console.log("KÓD DESTROYED 2");
            }
        }
        
        console.log("KÓD EXPIRED");
    
    }, 1 * 60000); // za jak dlouho vyprší kód. (v minutách)

    return response.redirect('/uzivatel/overeni');
}

exports.overit = (req, response) => {
    const kod = req.body.kod;

    if (req.session.uzivatel == undefined || req.session.kod == undefined){
        return response.render("uzivatel/overeni", {
            error: "Kód vypršel!",
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
            time: Date.now(), // zbývá 0 sekund.
        });
    }
    console.log("Overit kod: " + req.session.kod);


    if (req.session.kod != kod){
        return response.render("uzivatel/overeni", {
            error: "Špatný kód!",
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
            time: req.session.uzivatel[3],
        });
    }

    // if(model.pridatUzivatele(req.session.uzivatel[0], req.session.uzivatel[1], req.session.uzivatel[2]) == false) {
    //     return response.redirect('/web/error');
    // }
    model.pridatUzivatele(req.session.uzivatel[0], req.session.uzivatel[1], req.session.uzivatel[2]);


    return response.redirect('/uzivatel/prihlasit');
}

exports.prihlasit = (req, response) => {
    const jmeno = req.body.jmeno.trim().toLocaleLowerCase();
    const heslo = req.body.heslo.trim();

    if(!model.existujeUzivatel(jmeno)) {
        return response.render('uzivatel/prihlaseni', {
            error: 'Uživatel neexistuje!',
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        });
    }

    if(!model.spravneHeslo(jmeno, heslo)) {
        return response.render('uzivatel/prihlaseni', {
            error: 'Chybné heslo!',
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        });
    }

    req.session.prihlasenyUzivatel = model.existujeUzivatel(jmeno);

    return response.redirect('/web/index');
}

exports.profil = (req, response) => {
    if(!req.session.prihlasenyUzivatel) {
        return response.redirect('/uzivatel/prihlasit');
    }
    
    if (req.query.hlaska != undefined){
        model.odebratOblibenouHlasku(req.session.prihlasenyUzivatel, req.query.hlaska);
    }

    response.render('uzivatel/profil', {
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        hlasky: model.getOblibenyHlasky(req.session.prihlasenyUzivatel),
        highScore: model.getHighScore(req.session.prihlasenyUzivatel),
    });
}

exports.odhlasit = (req, response) => {
    req.session.destroy();
    response.redirect('/web/index');
}

exports.sinslavy = (req, res) => {
    const userData = model.getAllHighScore();
    const scores = userData[0];
    const users = userData[1];

    return res.render('uzivatel/sinslavy', {
        scores: scores,
        users: users,
        error: undefined,
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
    })
}