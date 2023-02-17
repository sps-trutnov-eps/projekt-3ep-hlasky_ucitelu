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
        score: req.session.score,
    });
     
}