const bcrypt = require('bcryptjs');
const jsondb = require('simple-json-db');
const db = new jsondb('./data/hlasky.json');

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

exports.randomUcitel = () => {
    const hlasky = db.JSON();
    const length = Object.keys(hlasky).length - 1;

    let randomCislo = Math.round(Math.random() * length);

    let spravnyUcitel = Object.keys(hlasky)[randomCislo];
    
    let spravnaHlaska = hlasky[spravnyUcitel]["hlasky"][Math.round(Math.random() * (hlasky[spravnyUcitel]["hlasky"].length - 1))];


    while (spravnaHlaska == "''"){
        spravnaHlaska = hlasky[spravnyUcitel]["hlasky"][Math.round(Math.random() * (hlasky[spravnyUcitel]["hlasky"].length - 1))];
    }

    console.log(spravnaHlaska);
    

    let spatneUcitele = [];

    for (let i = 0; i < 3;i++){
        let spatnyUcitel = Object.keys(hlasky)[Math.round(Math.random() * length)];

        while(spatnyUcitel.includes(spravnyUcitel) || spatneUcitele.includes(spatnyUcitel)){
            spatnyUcitel = Object.keys(hlasky)[Math.round(Math.random() * length)];
        }

        spatneUcitele.push(spatnyUcitel);
        
    }
    console.log(spatneUcitele);

    let listOdpovedi = [];

    spatneUcitele.forEach(ucitel => { //sice je to pomalejší takhle ale vypadá lépe
        listOdpovedi.push(ucitel); 
    });

    listOdpovedi.push(spravnyUcitel);


    listOdpovedi = shuffle_(listOdpovedi);

    console.log(listOdpovedi);



    return [spravnaHlaska, listOdpovedi];
}

//koukne se jestli zadaná odpověď je správná
exports.checkOdpoved = (ucitel, hlaska) => {
    const hlasky = db.JSON();
    const length = Object.keys(hlasky).length - 1;

    console.log("odpověď: ");
    console.log(hlasky[ucitel]["hlasky"].includes(hlaska));
    return hlasky[ucitel]["hlasky"].includes(hlaska);

}