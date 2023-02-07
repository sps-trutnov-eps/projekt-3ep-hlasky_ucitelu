exports.about = (req, res) => {
    res.render('web/about', {
        titulek: 'O aplikaci',
    });
}

exports.error = (req, res)=> {
    res.render('web/error', {
        titulek: 'Chyba',
        chyba: 'Nastala chyba.',
    });
}

exports.index = (req, res)=> {
    res.render('web/index', {
        titulek: 'Cvičná aplikace',
    });
}
