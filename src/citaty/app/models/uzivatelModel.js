const bcrypt = require('bcryptjs');
const { request } = require('express');
const jsondb = require('simple-json-db');
const { use } = require('../routers/uzivatelRouter');
const { uspesnost } = require('../controllers/hlaskyController');
const db = new jsondb('./data/uzivatele.json');

exports.pridatUzivatele = (jmeno, email, hashleHeslo) => {
    if(db.has(jmeno)) {
        return false;
    }
    
    db.set(jmeno, {
        heslo: hashleHeslo,
        email: email,
    });

    if(!db.has(jmeno)) {
        return false;
    }

    return true;
}

exports.existujeEmail = (zadanyEmail) => {
    const data = db.JSON();
    const uzivatele = Object.keys(data);

    let existuje = false;

    uzivatele.every(uzivatel => { // every se chová stejně jako forEach ale běží jenom dokuď se returnuje true.
                                  // tohle dělám abych nemusel prohledá vat celý list abych našel dublikat.
                                  // pry nejde z forEach se breaknout.
        email = data[uzivatel]["email"];
        console.log(email);

        if (email.includes(zadanyEmail)){
            console.log("INCLUDES");
            existuje = true; // chtěl jsem sem dát return true aby search byl rychlejší ale to prý nejde -_-
            return false //break
        }

        return true; // aby se nezastavil po 1 iteraci
    });
    return existuje;
}

exports.existujeUzivatel = (jmeno) => {
    let db_data = db.JSON();
    let existuje = false;
    Object.keys(db_data).forEach((entry) => {
        if(jmeno.toLowerCase() == entry.toLowerCase()){
            existuje = entry;
        }
    })
    return existuje;
}

exports.nacistUzivatele = (jmeno) => {
    let db_data = db.JSON();
    let uzivatel = undefined;
    Object.keys(db_data).forEach((entry) => {
        if(jmeno.toLowerCase() == entry.toLowerCase()){
            uzivatel = db_data[entry];
        }
    })
    return uzivatel;
}

exports.spravneHeslo = (jmeno, heslo) => {
    const uzivatel = exports.nacistUzivatele(jmeno);

    return bcrypt.compareSync(heslo, uzivatel.heslo);
}

exports.ulozitHighScore = (jmeno, score) => {
    if (jmeno==undefined||score==undefined){
        console.log("nedostatek argumentů.");} // chybová hláška

    let data = db.JSON()[jmeno];

    if (data.score == undefined){
        data.score = 0;
        db.set(jmeno, data); //ukládání do DB
    }

    if (data.score < score){
        data.score = score;
        db.set(jmeno, data);
    }
}

exports.getHighScore = (jmeno) => {
    if (jmeno==undefined){
    console.log("nedostatek argumentů.");} // chybová hláška

    let data = db.JSON()[jmeno];

    if (data.score == undefined){
        return 0;
    }
    
    return data.score;
}

exports.getTopScore = (top = 3) => {
    let data = db.JSON();
    const uzivatele = Object.keys(data);

    let uzivatelScore = [];

    for(let i = 0; i <= uzivatele.length - 1; i++){
        if (data[uzivatele[i]].score == undefined){
            uzivatelScore.push([0, uzivatele[i]]);
        }
        else{
            uzivatelScore.push([data[uzivatele[i]].score, uzivatele[i]]);
        }
    }

    let sorted = uzivatelScore.sort( (a, b) => {
        return b[0] - a[0]
    })

    let topPlayers = sorted.slice(0, top);

    // returne top počet hráču s nejlepším score. (např:. top 3 hráčy s nejlepším score)
    // list vypadá takhle: [ [ 30, 'ligma' ], [ 23, 'figma' ], [ 2, 'tektek' ] ]
    // [[score, jmeno]]

    const backupList = [[1, "uzivatel1"], [2, "uzivatel2"], [3, "uzivatel3"]];
    const topPlayersLength = topPlayers.length;

    if (topPlayers.length < 3 || topPlayers == undefined){
        for (let i = 0; i < Math.abs(topPlayersLength - 3); i++){
            topPlayers.push(backupList[i]);
        }
    }

    return topPlayers;

}

exports.getAllHighScore = () => {
    let data = db.JSON();
    const uzivatele = Object.keys(data);

    let uzivatelScore = [];

    for(let i = 0; i <= uzivatele.length - 1; i++){
        if (data[uzivatele[i]].score == undefined){
            uzivatelScore.push([0, uzivatele[i]]);
        }
        else{
            uzivatelScore.push([data[uzivatele[i]].score, uzivatele[i]]);
        }
    }

    const sorted = uzivatelScore.sort( (a, b) => {
        return b[0] - a[0]
    })

    return sorted;

}

exports.ulozitOblibenouHlasku = (jmeno, hlaska) => {
    if (jmeno==undefined||hlaska==undefined){
    console.log("nedostatek argumentů.");} // chybová hláška

    let data = db.JSON()[jmeno];

    if (data.oblibeneHlasky == undefined){
        data.oblibeneHlasky = [];
        db.set(jmeno, data);
    }
    if (!data.oblibeneHlasky.includes(hlaska)){
        data.oblibeneHlasky.push(hlaska);
        db.set(jmeno, data);
    }

}

exports.jeOblibenaHlaska = (jmeno, hlaska) => {
    if (jmeno==undefined||hlaska==undefined){
        console.log("nedostatek argumentů.");} // chybová hláška
    
        let data = db.JSON()[jmeno];
    
        if (data.oblibeneHlasky == undefined){
            data.oblibeneHlasky = [];
        }
        if (!data.oblibeneHlasky.includes(hlaska)){
            return true;
        }
        return false;
}

exports.getOblibenyHlasky = (jmeno) => {
    let data = db.JSON()[jmeno];
    let hlasky;

    if (data.oblibeneHlasky == undefined || data.oblibeneHlasky.length <= 0){
        hlasky = ["Nic Tady Není!"];
    }
    else{
        hlasky = data.oblibeneHlasky;
    }

    return hlasky;
}

exports.odebratOblibenouHlasku = (jmeno, hlaska) => {
    let hlaskyUzivatele = db.JSON()[jmeno];

    if (hlaskyUzivatele.oblibeneHlasky == undefined){
        return false;
    }

    hlaskyUzivatele.oblibeneHlasky = hlaskyUzivatele.oblibeneHlasky.filter(v => v !== hlaska); 
    db.set(jmeno, hlaskyUzivatele);
}

exports.smazatUzivatele = (jmeno, heslo) => {
    if (!exports.spravneHeslo(jmeno, heslo)){
        return false;
    } else{
        db.delete(jmeno);
    }
}

exports.ulozitUspesnostUzivatele = (jmeno, uspesnost) => {
    let hlaskyUzivatele = db.JSON()[jmeno];

    if (hlaskyUzivatele["pocet"] == undefined || hlaskyUzivatele["pocet"] == []){
        let cisla = [];
        for (let i = 0; i <= 10; i++){
            cisla.push(i);
        }
        hlaskyUzivatele["pocet"] = cisla;
    }

    if (hlaskyUzivatele["dobre"] == undefined){
        let cisla = [];
        for (let i = 0; i <= 10; i++){
            cisla.push(0);
        }
        hlaskyUzivatele["dobre"] = cisla;
    }

    hlaskyUzivatele["dobre"][uspesnost] = hlaskyUzivatele["dobre"][uspesnost] + 1;

    db.set(jmeno, hlaskyUzivatele);

}

exports.spocitatPrumernouUspesnostUzivatele = (jmeno) => {
    let hlaskyUzivatele = db.JSON()[jmeno];
    let prumer = 0;
    let pocet = 0;

    let error = undefined;

    if (hlaskyUzivatele["pocet"] == undefined || hlaskyUzivatele["pocet"] == []){
        error = "Nehrály jste herní režim o počítání ůspěšnosti.";
    }
    if (hlaskyUzivatele["dobre"] == undefined || hlaskyUzivatele["dobre"] == []){
        error = "Nehrály jste herní režim o počítání ůspěšnosti.";
    }


    if (error != undefined){
        return error;
    }

    for (let i = 0; i <= 10; i++){
        prumer += hlaskyUzivatele["pocet"][i] * hlaskyUzivatele["dobre"][i];
        pocet += hlaskyUzivatele["dobre"][i];

    }

    prumer = prumer / pocet;

    return prumer;


}