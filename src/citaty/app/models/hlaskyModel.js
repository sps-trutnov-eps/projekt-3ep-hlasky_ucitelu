const bcrypt = require('bcryptjs');
const jsondb = require('simple-json-db');
const db = new jsondb('./data/hlasky.json');


exports.randomUcitel = () => {
    const hlasky = db.JSON();
    const length = Object.keys(hlasky).length - 1;

    let randomCislo = Math.round(Math.random() * length);

    let spravnyUcitel = Object.keys(hlasky)[randomCislo];
    
    let spravnaHlaska = hlasky[spravnyUcitel]["hlasky"][Math.round(Math.random() * (hlasky[spravnyUcitel]["hlasky"].length - 1))];
    console.log(spravnyUcitel);
    console.log(spravnaHlaska);
    

    let spatneUcitele = [];

    for (let i = 0; i < 3;i++){
        let spatnyUcitel = Object.keys(hlasky)[Math.round(Math.random() * length)];
        spatneUcitele.push(spatnyUcitel);
        
    }
    
    return [spravnaHlaska, spatneUcitele, spravnyUcitel];
}
