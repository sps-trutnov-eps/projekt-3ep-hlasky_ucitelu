const model = require('../models/hlaskyModel');

let randomSeznamUcitelu = model.randomUcitel();

exports.randomUcitel = (req, res) => {
    if (req.query.ucitel == undefined || req.query.hlaska == undefined){
        randomSeznamUcitelu = model.randomUcitel();
        return res.render('hlasky/random', {
            // spravnaHlaska, spatneUcitele, ucitel
            hlaska: randomSeznamUcitelu[0],
            spravny: randomSeznamUcitelu[2],
            spatny: randomSeznamUcitelu[1],
            odpoved: "",
        });
    }
    
    if (model.checkOdpoved(req.query.ucitel, req.query.hlaska)){ //pokud zodpověděl zprávně:
        randomSeznamUcitelu = model.randomUcitel();
        return res.render('hlasky/random', {
            // spravnaHlaska, spatneUcitele, ucitel
            hlaska: randomSeznamUcitelu[0],
            spravny: randomSeznamUcitelu[2],
            spatny: randomSeznamUcitelu[1],
            odpoved: "Správně",
        });
    }
    else{
        return res.render('hlasky/random', {
            // spravnaHlaska, spatneUcitele, ucitel
            hlaska: randomSeznamUcitelu[0],
            spravny: randomSeznamUcitelu[2],
            spatny: randomSeznamUcitelu[1],
            odpoved: "Špatně",
        });
    }

}