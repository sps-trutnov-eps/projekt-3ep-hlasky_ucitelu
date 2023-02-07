const model = require('../models/hlaskyModel');

exports.randomUcitel = (request, response) => {
    response.render('hlasky/random', {
        // spravnaHlaska, spatneUcitele, ucitel
        hlaska: model.randomUcitel()[0],
        spravny: model.randomUcitel()[2],
        spatny: model.randomUcitel()[1],

        //titulek: 'Registrace',
    });
}