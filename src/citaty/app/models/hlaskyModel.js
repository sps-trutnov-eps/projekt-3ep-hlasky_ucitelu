const bcrypt = require('bcryptjs');
const jsondb = require('simple-json-db');
const db = new jsondb('./data/hlasky.json');


exports.randomUcitel = () => {
    const hlasky = db.JSON();
    const length = Object.keys(hlasky).length - 1;

    let randomCislo = Math.round(Math.random() * length);

    let spravnyUcitel = Object.keys(hlasky)[randomCislo];
    
    let spravnaHlaska = hlasky[spravnyUcitel]["hlasky"][Math.round(Math.random() * (hlasky[spravnyUcitel]["hlasky"].length - 1))];
    console.log(spravnaHlaska);

    while (spravnaHlaska == "''"){
        spravnaHlaska = hlasky[spravnyUcitel]["hlasky"][Math.round(Math.random() * (hlasky[spravnyUcitel]["hlasky"].length - 1))];
    }

    console.log(spravnaHlaska);
    

    let spatneUcitele = [];

    for (let i = 0; i < 3;i++){
        let spatnyUcitel = Object.keys(hlasky)[Math.round(Math.random() * length)];
        spatneUcitele.push(spatnyUcitel);
        
    }
    
    return [spravnaHlaska, spatneUcitele, spravnyUcitel];
}

//koukne se jestli zadaná odpověď je správná
exports.checkOdpoved = (ucitel, hlaska) => {
    const hlasky = db.JSON();
    const length = Object.keys(hlasky).length - 1;

    console.log("odpověď: ");
    console.log(hlasky[ucitel]["hlasky"].includes(hlaska));
    return hlasky[ucitel]["hlasky"].includes(hlaska);


}