const model = require('../models/hlaskyModel');
const uzivatelModel = require('../models/uzivatelModel');

let score = 0;

exports.randomKviz = (req, res) => {
    //score = 0;

    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }

    if(req.query.like){
        console.log("CUMPISSSS");
        let hlaska = req.session.randomSeznamUcitelu[0];
        uzivatelModel.ulozitOblibenouHlasku(req.session.prihlasenyUzivatel, hlaska);
    }
    else{
        score = 0;
        req.session.randomSeznamUcitelu = model.randomUcitel();
    }

    return res.render('hlasky/random', {
        // spravnaHlaska, listOdpovedi
        hlaska: req.session.randomSeznamUcitelu[0],
        odpovedi: req.session.randomSeznamUcitelu[1],
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
        score: score,
    });
     
}