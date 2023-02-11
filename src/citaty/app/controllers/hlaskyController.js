const model = require('../models/hlaskyModel');

let randomSeznamUcitelu = model.randomUcitel();
let score = 0;

exports.randomUcitel = (req, res) => {

    if (req.query.new == true){
        score = 0;
    }

    if (req.query.ucitel == undefined || req.query.hlaska == undefined){
        randomSeznamUcitelu = model.randomUcitel();
        return res.render('hlasky/random', {
            // spravnaHlaska, spatneUcitele, ucitel
            hlaska: randomSeznamUcitelu[0],
            spravny: randomSeznamUcitelu[2],
            spatny: randomSeznamUcitelu[1],
            odpoved: "",
            score: score,
        });
    }
    
    if (model.checkOdpoved(req.query.ucitel, req.query.hlaska)){ // pokud zodpověděl zprávně:

        randomSeznamUcitelu = model.randomUcitel();
        score += 1;

        return res.render('hlasky/random', {
            // spravnaHlaska, spatneUcitele, ucitel
            hlaska: randomSeznamUcitelu[0],
            spravny: randomSeznamUcitelu[2],
            spatny: randomSeznamUcitelu[1],
            score: score,
            odpoved: "Správně",
        });
    }
    else{

        // sem příjde logika pro ukládání nejvyžšího score
        // až budou hotové profily.
        
        score = 0;

        return res.render('hlasky/random', { // pokud nezodpověděl zprávně:
            // spravnaHlaska, spatneUcitele, ucitel
            hlaska: randomSeznamUcitelu[0],
            spravny: randomSeznamUcitelu[2],
            spatny: randomSeznamUcitelu[1],
            score: score,
            odpoved: "Špatně",
        });
    }

}