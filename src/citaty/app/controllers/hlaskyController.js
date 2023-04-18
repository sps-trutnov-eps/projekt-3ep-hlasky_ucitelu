const model = require('../models/hlaskyModel');
const uzivatelModel = require('../models/uzivatelModel');

function likeStar(jmeno, hlaska){
    let liked = "☆";
    if (!uzivatelModel.jeOblibenaHlaska(jmeno, hlaska)){ // ptá se jestli je hláška oblíbenná
        liked = "★";
    }
    return liked;
}

exports.randomKviz = (req, res) => {

    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }


    if(req.query.like){
        const liked = likeStar(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);
        if (liked == "★"){
            uzivatelModel.odebratOblibenouHlasku(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);
        }
        else{
            uzivatelModel.ulozitOblibenouHlasku(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);
        }
    }
    else{
        req.session.score = 0;
        req.session.randomSeznamUcitelu = model.randomUcitel(req.session.seznamProslychHlasek);

        if (req.session.seznamProslychHlasek == undefined){
            req.session.seznamProslychHlasek = [];
        }
        if (req.session.seznamProslychHlasek.length > 10){
            req.session.seznamProslychHlasek = req.session.seznamProslychHlasek.slice(-10);
        }
        req.session.seznamProslychHlasek.push(req.session.randomSeznamUcitelu[0]);
    }

    const liked = likeStar(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);

    return res.render('hlasky/random', {
        // spravnaHlaska, listOdpovedi
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        hlaska: req.session.randomSeznamUcitelu[0],
        odpovedi: req.session.randomSeznamUcitelu[1],
        score: req.session.score,
        liked: liked,
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

    randomSeznamUcitelu = model.randomUcitel(req.session.seznamProslychHlasek);
    
    if (req.session.seznamProslychHlasek == undefined){
        req.session.seznamProslychHlasek = [];
    }
    if (req.session.seznamProslychHlasek.length > 10){
        req.session.seznamProslychHlasek = req.session.seznamProslychHlasek.slice(-10);
    }

    req.session.randomSeznamUcitelu = randomSeznamUcitelu;

    const liked = likeStar(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);

    return res.render('hlasky/random', {
        // spravnaHlaska, listOdpovedi 
        hlaska: randomSeznamUcitelu[0],
        odpovedi: randomSeznamUcitelu[1],
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        score: req.session.score,
        liked: liked,
    });
}

exports.uspesnost = (req, res) => {
    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }

    if (req.session.quizDokoncen == undefined){
        req.session.quizDokoncen = false;
    } 

    if(req.session.quizDokoncen == true){

        if(req.query.restart == "true"){
            req.session.zodpovezeno = 0;
            req.session.vysledek = 0;
            req.session.quizDokoncen = false;

            const liked = likeStar(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);
            return res.render("hlasky/uspesnost", {
                hlaska: req.session.randomSeznamUcitelu[0],
                odpovedi: req.session.randomSeznamUcitelu[1],
                jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
                zodpovezeno: req.session.zodpovezeno,
                plnyPocet: req.session.plnyPocet || 10,
                quizDokoncen: false,
                vysledneSkore: undefined,
                liked: liked,
            });
        } else {

            return res.render("hlasky/uspesnost",{
                plnyPocet: req.session.plnyPocet || 10,
                zodpovezeno: req.session.zodpovezeno || 0,
                vysledneSkore: req.session.vysledek || "kys",
                jmeno: req.session.prihlasenyUzivatel,
                quizDokoncen: true,
            });
        }

    } else {

        if(req.query.like){
            const liked = likeStar(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);
            if (liked == "★"){
                uzivatelModel.odebratOblibenouHlasku(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);
            }
            else{
                uzivatelModel.ulozitOblibenouHlasku(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);
            }
        }
        else{
            req.session.randomSeznamUcitelu = model.randomUcitel(req.session.seznamProslychHlasek);
            req.session.zodpovezeno = 0;
            req.session.scoreuspesnosti = 0;
            
            if (req.session.seznamProslychHlasek == undefined){
                req.session.seznamProslychHlasek = [];
            }
            if (req.session.seznamProslychHlasek.length > 10){
                req.session.seznamProslychHlasek = req.session.seznamProslychHlasek.slice(-10);
            }
            req.session.seznamProslychHlasek.push(req.session.randomSeznamUcitelu[0]);
        }

        const liked = likeStar(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);

        return res.render("hlasky/uspesnost",{
            hlaska: req.session.randomSeznamUcitelu[0],
            odpovedi: req.session.randomSeznamUcitelu[1],
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
            zodpovezeno: req.session.zodpovezeno || 0,
            plnyPocet: req.session.plnyPocet || 10,
            quizDokoncen: false,
            vysledneSkore: undefined,
            liked: liked,
        });
    }
}

exports.procentaUspesnosti = (req, res) => { //post funkce pro bodovaný kvíz
    const plnypocet = 10;
    let vysledek = req.session.vysledek || undefined;

    if (req.session.quizDokoncen == undefined){
     req.session.quizDokoncen = false;
    }    
    
    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }

    const ucitel = req.body.ucitel;
    const hlaska = req.session.randomSeznamUcitelu[0];

    if (model.checkOdpoved(ucitel, hlaska)){
        req.session.scoreuspesnosti += 1;
    }
    const pocetDobrych = req.session.scoreuspesnosti;

    req.session.zodpovezeno +=1;
    req.session.plnypocet = plnypocet;
    
    if(req.session.zodpovezeno >= plnypocet){
        req.session.zodpovezeno = 0;
        vysledek = (pocetDobrych/plnypocet)*100;
        req.session.quizDokoncen = true;
        req.session.vysledek = vysledek;
    }

    req.session.randomSeznamUcitelu = model.randomUcitel(req.session.seznamProslychHlasek);

    if (req.session.seznamProslychHlasek == undefined){
        req.session.seznamProslychHlasek = [];
    }
    if (req.session.seznamProslychHlasek.length > 10){
        req.session.seznamProslychHlasek = req.session.seznamProslychHlasek.slice(-10);
    }
    req.session.seznamProslychHlasek.push(req.session.randomSeznamUcitelu[0]);

    const liked = likeStar(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);

    return res.render("hlasky/uspesnost",{
        hlaska: req.session.randomSeznamUcitelu[0],
        odpovedi: req.session.randomSeznamUcitelu[1],
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        zodpovezeno: req.session.zodpovezeno,
        quizDokoncen: req.session.quizDokoncen,
        plnyPocet: plnypocet,
        vysledneSkore: vysledek,
        liked: liked,
    });
}

exports.vysledneSkore = (req, res) => {
    const pocetDobrych = req.session.scoreuspesnosti;
    const vysledek = (pocetDobrych/10)*100;

    return res.render("hlasky/vysledneSkore",{
        vyslednaPorcenta: vysledek,
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
    });
}


