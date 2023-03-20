const model = require('../models/hlaskyModel');
const uzivatelModel = require('../models/uzivatelModel');

exports.randomKviz = (req, res) => {

    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }

    if(req.query.like){
        let hlaska = req.session.randomSeznamUcitelu[0];
        uzivatelModel.ulozitOblibenouHlasku(req.session.prihlasenyUzivatel, hlaska);
    }
    else{
        req.session.score = 0;
        req.session.randomSeznamUcitelu = model.randomUcitel();
    }

    return res.render('hlasky/random', {
        // spravnaHlaska, listOdpovedi
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        hlaska: req.session.randomSeznamUcitelu[0],
        odpovedi: req.session.randomSeznamUcitelu[1],
        score: req.session.score,
    });
     
}

exports.odpovedNaRandomKviz = (req, res) => {
    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }
    if (req.session.score == undefined){
        req.session.score = 0;
    }

    let randomSeznamUcitelu = req.session.randomSeznamUcitelu;

    let ucitel = req.body.ucitel;
    let hlaska = randomSeznamUcitelu[0];

    if (model.checkOdpoved(ucitel, hlaska)){
        req.session.score += 1;
    }
    else{
        req.session.score = 0;
    }
    uzivatelModel.ulozitHighScore(req.session.prihlasenyUzivatel, req.session.score);

    randomSeznamUcitelu = model.randomUcitel();
    req.session.randomSeznamUcitelu = randomSeznamUcitelu;

    return res.render('hlasky/random', {
        // spravnaHlaska, listOdpovedi
        hlaska: randomSeznamUcitelu[0],
        odpovedi: randomSeznamUcitelu[1],
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        score: req.session.score,
    });
}



exports.uspesnost = (req, res) => {
    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }

    req.session.zodpovezeno = 0;
    req.session.scoreuspesnosti = 0;

    let randomSeznamUcitelu = model.randomUcitel();
    req.session.randomSeznamUcitelu = randomSeznamUcitelu;

    return res.render("hlasky/uspesnost",{
        hlaska: randomSeznamUcitelu[0],
        odpovedi: randomSeznamUcitelu[1],
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
    });
}

exports.procentaUspesnosti = (req, res) => {
    const plnypocet = 10;

    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }

    const ucitel = req.body.ucitel;
    const hlaska = req.session.randomSeznamUcitelu[0];

    if (model.checkOdpoved(ucitel, hlaska)){
        req.session.scoreuspesnosti += 1;
    }

    req.session.zodpovezeno +=1;

    if(req.session.zodpovezeno >= 10){
        req.session.zodpovezeno = 0;
        //req.session.scoreuspesnosti = 0;
        return res.redirect("/hlasky/vysledneSkore")
    }

    req.session.randomSeznamUcitelu = model.randomUcitel();
    return res.render("hlasky/uspesnost",{
        hlaska: req.session.randomSeznamUcitelu[0],
        odpovedi: req.session.randomSeznamUcitelu[1],
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
    });
}

exports.vysledneSkore = (req, res) => {
    const pocetDobrych = req.session.scoreuspesnosti;
    const vysledek = (pocetDobrych/10)*100;

    console.log(pocetDobrych);

    return res.render("hlasky/vysledneSkore",{
        vyslednaPorcenta: vysledek,
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
    });
}


