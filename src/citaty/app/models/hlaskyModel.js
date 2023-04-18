const bcrypt = require('bcryptjs');
const jsondb = require('simple-json-db');
const db = new jsondb('./data/hlasky.json');


function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

// někdy internet nepomůže :(
function shuffle_(arr) { // ta funkce se nemůže jmenovat shuffle přezto že shuffle funce prý neexistuje
    let newArr = [];    // miluju javaSctipt

    while(arr.length > 0){
        let length = arr.length -1;
        let randomNum = Math.round(Math.random() * length);

        newArr.push(arr[randomNum]);
        
        arr.splice(randomNum, 1);
    }
    return newArr;
}

exports.randomUcitel = (seznamProslychHlasek = []) => {
    if (seznamProslychHlasek != []){
        if (seznamProslychHlasek.length > 10){
            seznamProslychHlasek = seznamProslychHlasek.slice(-10);
        }
    }
    
    const hlasky = db.JSON();
    const length = Object.keys(hlasky).length - 1;

    let spravnaHlaska;

    let contans = true;
    if (seznamProslychHlasek != []){
        while (contans){
            spravnyUcitel = Object.keys(hlasky)[Math.round(Math.random() * length)];

            spravnaHlaska = hlasky[spravnyUcitel]["hlasky"][Math.round(Math.random() * (hlasky[spravnyUcitel]["hlasky"].length - 1))];

            while (spravnaHlaska == "''"){
                spravnaHlaska = hlasky[spravnyUcitel]["hlasky"][Math.round(Math.random() * (hlasky[spravnyUcitel]["hlasky"].length - 1))];
            }

            contans = seznamProslychHlasek.includes(spravnaHlaska);
        }

    }
    else{
        spravnyUcitel = Object.keys(hlasky)[Math.round(Math.random() * length)];
        spravnaHlaska = hlasky[spravnyUcitel]["hlasky"][Math.round(Math.random() * (hlasky[spravnyUcitel]["hlasky"].length - 1))];
        
        
        while (spravnaHlaska == "''"){
            spravnaHlaska = hlasky[spravnyUcitel]["hlasky"][Math.round(Math.random() * (hlasky[spravnyUcitel]["hlasky"].length - 1))];
        }
    } 

    let spatneUcitele = [];

    for (let i = 0; i < 3;i++){
        let spatnyUcitel = Object.keys(hlasky)[Math.round(Math.random() * length)];

        while ((hlasky[spatnyUcitel]["gender"] != hlasky[spravnyUcitel]["gender"]) || (spatnyUcitel.includes(spravnyUcitel) || spatneUcitele.includes(spatnyUcitel))){
            spatnyUcitel = Object.keys(hlasky)[Math.round(Math.random() * length)];
        }

        // while(spatnyUcitel.includes(spravnyUcitel) || spatneUcitele.includes(spatnyUcitel)){
        //     spatnyUcitel = Object.keys(hlasky)[Math.round(Math.random() * length)];
        // }

        spatneUcitele.push(spatnyUcitel);
        
    }

    let listOdpovedi = [];

    spatneUcitele.forEach(ucitel => { //sice je to pomalejší takhle ale vypadá lépe
        listOdpovedi.push(ucitel); 
    });

    listOdpovedi.push(spravnyUcitel);
    console.log(spravnyUcitel); // pro debugování

    listOdpovedi = shuffle_(listOdpovedi);

    return [spravnaHlaska, listOdpovedi];
}

//koukne se jestli zadaná odpověď je správná
exports.checkOdpoved = (ucitel, hlaska) => {
    const hlasky = db.JSON();
    const length = Object.keys(hlasky).length - 1;

    return hlasky[ucitel]["hlasky"].includes(hlaska);

}

exports.getSpravnaOdpoved = (hlaska) => {
    const hlasky = db.JSON();

    let vysledek = "piss";

    Object.keys(hlasky).forEach(ucitel => {
        if (hlasky[ucitel]["hlasky"].includes(hlaska)){
            vysledek = ucitel;
        }
        
    });

    return vysledek

}