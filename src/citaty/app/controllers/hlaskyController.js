const model = require('../models/hlaskyModel');
const uzivatelModel = require('../models/uzivatelModel');

let score = 0;



exports.randomKviz = (req, res) => {
    score = 0;

    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }

    let randomSeznamUcitelu = model.randomUcitel();
    req.session.randomSeznamUcitelu = randomSeznamUcitelu;
    
    return res.render('hlasky/random', {
        // spravnaHlaska, listOdpovedi
        hlaska: randomSeznamUcitelu[0],
        odpovedi: randomSeznamUcitelu[1],
        odpoved: "",
        score: score,
    });
     
}

exports.odpovedNaRandomKviz = (req, res) => {
    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }

    let randomSeznamUcitelu = req.session.randomSeznamUcitelu;

    let ucitel = req.body.ucitel;
    let hlaska = randomSeznamUcitelu[0];

    if (model.checkOdpoved(ucitel, hlaska)){
        score += 1;
    }
    else{
        score = 0;
    }
    uzivatelModel.ulozitHighScore(req.session.prihlasenyUzivatel, score);

    randomSeznamUcitelu = model.randomUcitel();
    req.session.randomSeznamUcitelu = randomSeznamUcitelu;

    return res.render('hlasky/random', {
        // spravnaHlaska, listOdpovedi
        hlaska: randomSeznamUcitelu[0],
        odpovedi: randomSeznamUcitelu[1],
        odpoved: "",
        score: score,
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
    });
}

exports.vysledneSkore = (req, res) => {
    const pocetDobrych = req.session.scoreuspesnosti;
    const vysledek = (pocetDobrych/10)*100;

    console.log(pocetDobrych);

    return res.render("hlasky/vysledneSkore",{
        vyslednaPorcenta: vysledek,
    });
}


