const bcrypt = require('bcryptjs');
const jsondb = require('simple-json-db');
const db = new jsondb('./data/hlasky.json');


exports.randomUcitel = () => {
    const hlasky = db.JSON();
    const length = Object.keys(hlasky).length - 1;

    let randomCislo = Math.round(Math.random() * length);

    let ucitel = Object.keys(hlasky)[randomCislo];

    let spravnaHlaska = hlasky[ucitel]["hlasky"][Math.round(Math.random() * (hlasky[ucitel]["hlasky"].length - 1))];


    let spatneUcitele = [];

    for (let i = 1; i < 3;i++){
        let spatnyUcitel = Object.keys(hlasky)[Math.round(Math.random() * length)];
        spatneUcitele.push(spatnyUcitel);
        
    }
    
    return [spravnaHlaska, spatneUcitele, ucitel];
}
