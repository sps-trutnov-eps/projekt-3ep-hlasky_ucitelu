const model = require('../models/hlaskyModel');
const uzivatelModel = require('../models/uzivatelModel');

function likeStar(jmeno, hlaska){
    let liked = "☆";
    if (!uzivatelModel.jeOblibenaHlaska(jmeno, hlaska)){ // ptá se jestli je hláška oblíbenná
        liked = "★";
    }
    return liked;
}

function pridatSptneOdpovedi(hlaska, spatneOdpovedi){

    console.log(spatneOdpovedi);

    if (spatneOdpovedi == undefined){
        spatneOdpovedi = [];
    }

    return spatneOdpovedi.push(hlaska);
}

function mazatSpatneOdpovedi() {
    return spatneOdpovedi = undefined;
}

exports.randomKviz = (req, res) => { // GET ASI?

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
        req.session.spatneOdpovedi = undefined;
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

exports.odpovedNaRandomKviz = (req, res) => { // POST??
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
    if (!model.checkOdpoved(ucitel, req.session.randomSeznamUcitelu[0])){
        if (req.session.spatneOdpovedi == undefined){
            req.session.spatneOdpovedi = [];
        }
        // [[hláška, správný učitel, co jste zvolily vy]]
        req.session.spatneOdpovedi.push([req.session.randomSeznamUcitelu[0], model.getSpravnaOdpoved(req.session.randomSeznamUcitelu[0]), ucitel]);
        //req.session.spatneOdpovedi = pridatSptneOdpovedi("req.session.randomSeznamUcitelu[0]", req.session.spatneOdpovedi);
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

// NÁHLÁ SMRT ^^^^






// BODOVANÝ KVÍZ ˘˘˘˘

exports.uspesnost = (req, res) => { // GET
    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }

    if (req.session.quizDokoncen == undefined){
        req.session.quizDokoncen = false;
    } 

    if(req.session.quizDokoncen == true){
        if(req.query.restart == "true"){ // PŘI RESTARTU
            req.session.zodpovezeno = 0;
            req.session.quizDokoncen = false;
            req.session.scoreuspesnosti = 0;
            req.session.spatneOdpovedi = undefined;

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
                vysledneSkore: req.session.vysledneSkore || "0", // Defaultně dostane 0%
                jmeno: req.session.prihlasenyUzivatel,
                quizDokoncen: true,
                spatneOdpovedi: req.session.spatneOdpovedi,
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
            req.session.spatneOdpovedi = undefined;
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

exports.procentaUspesnosti = (req, res) => { //POST funkce pro bodovaný kvíz
    const plnypocet = 10;


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
    if (!model.checkOdpoved(ucitel, req.session.randomSeznamUcitelu[0])){
        if (req.session.spatneOdpovedi == undefined){
            req.session.spatneOdpovedi = [];
        }
        // [[hláška, správný učitel, co jste zvolily vy]]
        req.session.spatneOdpovedi.push([req.session.randomSeznamUcitelu[0], model.getSpravnaOdpoved(req.session.randomSeznamUcitelu[0]), ucitel]);
        //req.session.spatneOdpovedi = pridatSptneOdpovedi("req.session.randomSeznamUcitelu[0]", req.session.spatneOdpovedi);
    }
    console.log(req.session.spatneOdpovedi);
    const pocetDobrych = req.session.scoreuspesnosti;
    //console.log(model.getSpravnaOdpoved(req.session.randomSeznamUcitelu[0]));

    req.session.zodpovezeno +=1;
    req.session.plnypocet = plnypocet;
    
    if(req.session.zodpovezeno >= plnypocet){
        req.session.zodpovezeno = 0;
        req.session.vysledneSkore = (pocetDobrych/plnypocet)*100;
        req.session.quizDokoncen = true;
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
        vysledneSkore: req.session.vysledneSkore,
        liked: liked,
        spatneOdpovedi: req.session.spatneOdpovedi,
    });
}

exports.vysledneSkore = (req, res) => { // ZOBRAZENÍ SKÓRE
    const pocetDobrych = req.session.scoreuspesnosti;
    const vysledek = (pocetDobrych/10)*100;



    return res.render("hlasky/vysledneSkore",{
        vyslednaPorcenta: vysledek,
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
    });
}
