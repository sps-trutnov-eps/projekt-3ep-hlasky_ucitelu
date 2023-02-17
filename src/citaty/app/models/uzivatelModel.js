const bcrypt = require('bcryptjs');
const { request } = require('express');
const jsondb = require('simple-json-db');
const db = new jsondb('./data/uzivatele.json');

exports.pridatUzivatele = (jmeno, email, heslo) => {
    if(db.has(jmeno)) {
        return false;
    }

    db.set(jmeno, {
        heslo: bcrypt.hashSync(heslo, 10),
        email: email,
    });

    if(!db.has(jmeno)) {
        return false;
    }

    return true;
}

exports.existujeUzivatel = (jmeno) => {
    return db.has(jmeno);
}

exports.nacistUzivatele = (jmeno) => {
    const data = db.get(jmeno);

    data.jmeno = jmeno;

    return data;
}

exports.spravneHeslo = (jmeno, heslo) => {
    const uzivatel = db.get(jmeno);

    return bcrypt.compareSync(heslo, uzivatel.heslo);
}

exports.ulozitHighScore = (jmeno, score) => {
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

exports.getOblibenyHlasky = (jmeno) => {
    let data = db.JSON()[jmeno];
    let hlasky;

    if (data.oblibeneHlasky == undefined){
        hlasky = ["Nemáte uloženné žádné hlášky!"];
    }
    else{
        hlasky = data.oblibeneHlasky;
    }

    return hlasky;
}