const model = require('../models/hlaskyModel');

exports.randomUcitel = (request, response) => {
    let randomSeznamUcitelu = model.randomUcitel();
    response.render('hlasky/random', {
        // spravnaHlaska, spatneUcitele, ucitel
        hlaska: randomSeznamUcitelu[0],
        spravny: randomSeznamUcitelu[2],
        spatny: randomSeznamUcitelu[1],

        //titulek: 'Registrace',
    });
}