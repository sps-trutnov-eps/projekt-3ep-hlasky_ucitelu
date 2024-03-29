const model = require('../models/hlaskyModel');
const uzivatelModel = require('../models/uzivatelModel');

function likeStar(jmeno, hlaska){
    let liked = "☆";
    if (!uzivatelModel.jeOblibenaHlaska(jmeno, hlaska)){ // ptá se jestli je hláška oblíbenná
        liked = "★";
    }
    return liked;
}


exports.randomKviz = (req, res) => { // GET

    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }

    if (req.session.randQuizDokoncen == undefined){
        req.session.randQuizDokoncen = false;
    }
    if (req.session.spatnaOdpoved == undefined){
        req.session.spatnaOdpoved = ["Nastala", "někde", "chyba"];
    }

    if (req.session.dysplayScore == undefined){
        req.session.dysplayScore = 0;
    }

    if (req.query.restart == "true"){
        req.session.score = 0;
        req.session.randQuizDokoncen = false;
        console.log("piss");
    }


    if (req.session.randQuizDokoncen == true){

        return res.render('hlasky/random', {
            jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
            hlaska: req.session.randomSeznamUcitelu[0],
            odpovedi: req.session.randomSeznamUcitelu[1],
            score: req.session.dysplayScore,
            quizDokoncen: req.session.randQuizDokoncen,
            liked: likeStar(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]),
            spatnaOdpoved: req.session.spatnaOdpoved,
        });
    }else{
        req.session.dysplayScore = 0; // tohle tady nemusí být.
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

        req.session.seznamProslychHlasek.push(req.session.randomSeznamUcitelu[0]);
        
        if (req.session.seznamProslychHlasek.length > 10){
            req.session.seznamProslychHlasek = req.session.seznamProslychHlasek.slice(-10);
        }
    }

    const liked = likeStar(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);

    return res.render('hlasky/random', {
        // spravnaHlaska, listOdpovedi
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        hlaska: req.session.randomSeznamUcitelu[0],
        odpovedi: req.session.randomSeznamUcitelu[1],
        score: req.session.score,
        quizDokoncen: req.session.randQuizDokoncen,
        liked: liked,
        spatnaOdpoved: req.session.spatnaOdpoved,
    });
}

exports.odpovedNaRandomKviz = (req, res) => { // POST
    if (req.session.prihlasenyUzivatel == undefined){
        return res.redirect('/uzivatel/prihlasit');
    }
    if (req.session.score == undefined){
        req.session.score = 0;
    }

    if (req.session.spatnaOdpoved == undefined){
        req.session.spatnaOdpoved = ["Nastala", "někde", "chyba"];
    }

    if (req.session.randQuizDokoncen){
        return res.redirect('/hlasky/random');
    }


    let ucitel = req.body.ucitel;
    let hlaska = req.session.randomSeznamUcitelu[0];

    if (model.checkOdpoved(ucitel, hlaska)){
        req.session.score += 1;
    }
    else{
        req.session.randQuizDokoncen = true;
        req.session.dysplayScore = req.session.score;
        req.session.score = 0;
        req.session.spatnaOdpoved = [req.session.randomSeznamUcitelu[0],  model.getSpravnaOdpoved(req.session.randomSeznamUcitelu[0]), ucitel]
    }

    if (req.body.restart == "Hrát znovu"){
        req.session.randQuizDokoncen = false;
        return res.redirect('/hlasky/random');
    }

    if (req.session.randQuizDokoncen){
        return res.redirect('/hlasky/random');
    }

    uzivatelModel.ulozitHighScore(req.session.prihlasenyUzivatel, req.session.score);

    req.session.randomSeznamUcitelu = model.randomUcitel(req.session.seznamProslychHlasek);
    
    if (req.session.seznamProslychHlasek == undefined){
        req.session.seznamProslychHlasek = [];
    }
    
    req.session.seznamProslychHlasek.push(req.session.randomSeznamUcitelu[0]);

    if (req.session.seznamProslychHlasek.length > 10){
        req.session.seznamProslychHlasek = req.session.seznamProslychHlasek.slice(-10);
    }

    const liked = likeStar(req.session.prihlasenyUzivatel, req.session.randomSeznamUcitelu[0]);


    
    return res.render('hlasky/random', {
        // spravnaHlaska, listOdpovedi 
        hlaska: req.session.randomSeznamUcitelu[0],
        odpovedi: req.session.randomSeznamUcitelu[1],
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
        score: req.session.score,
        liked: liked,
        spatneOdpovedi: req.session.spatneOdpovedi,
        quizDokoncen: req.session.randQuizDokoncen,
        spatnaOdpoved: req.session.spatnaOdpoved,
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
            // mazání listu špatě zodpovězenných hlášek.
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
                spatneOdpovedi: req.session.spatneOdpovedi,
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
            // mazání listu špatě zodpovězenných hlášek.
            req.session.spatneOdpovedi = undefined;
            req.session.zodpovezeno = 0;
            req.session.scoreuspesnosti = 0;
            
            if (req.session.seznamProslychHlasek == undefined){
                req.session.seznamProslychHlasek = [];
            }

            req.session.seznamProslychHlasek.push(req.session.randomSeznamUcitelu[0]);

            if (req.session.seznamProslychHlasek.length > 10){
                req.session.seznamProslychHlasek = req.session.seznamProslychHlasek.slice(-10);
            }
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
            spatneOdpovedi: req.session.spatneOdpovedi,
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

    // zapisování špatně zodpovězených hlášek do listu
    if (!model.checkOdpoved(ucitel, req.session.randomSeznamUcitelu[0])){
        if (req.session.spatneOdpovedi == undefined){
            req.session.spatneOdpovedi = [];
        }
        if (req.session.quizDokoncen == false){
            // [[hláška, správný učitel, co jste zvolily vy]]
            req.session.spatneOdpovedi.push([req.session.randomSeznamUcitelu[0], model.getSpravnaOdpoved(req.session.randomSeznamUcitelu[0]), ucitel]);
        }
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

        uzivatelModel.ulozitUspesnostUzivatele(req.session.prihlasenyUzivatel, pocetDobrych);
    }

    req.session.randomSeznamUcitelu = model.randomUcitel(req.session.seznamProslychHlasek);

    if (req.session.seznamProslychHlasek == undefined){
        req.session.seznamProslychHlasek = [];
    }

    req.session.seznamProslychHlasek.push(req.session.randomSeznamUcitelu[0]);

    if (req.session.seznamProslychHlasek.length > 10){
        req.session.seznamProslychHlasek = req.session.seznamProslychHlasek.slice(-10);
    }

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

exports.vysledneSkore = (req, res) => { // ZOBRAZENÍ SKÓRE // nepoužívá se.
    const pocetDobrych = req.session.scoreuspesnosti;
    const vysledek = (pocetDobrych/10)*100;


    return res.render("hlasky/vysledneSkore",{
        vyslednaPorcenta: vysledek || 10,
        jmeno: req.session.prihlasenyUzivatel || "Přihlásit se",
    });
}