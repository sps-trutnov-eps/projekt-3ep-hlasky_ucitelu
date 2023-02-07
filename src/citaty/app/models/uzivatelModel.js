const bcrypt = require('bcryptjs');
const jsondb = require('simple-json-db');
const db = new jsondb('./data/uzivatele.json');

exports.pridatUzivatele = (jmeno, heslo) => {
    if(db.has(jmeno)) {
        return false;
    }

    db.set(jmeno, {
        heslo: bcrypt.hashSync(heslo, 10),
    });

    if(!db.has(jmeno)) {
        return false;
    }

    return true;
}

exports.existujeUzivatel = (jmeno) => {
    return db.has(jmeno);
}

exports.nacistUzivatele = (jmeno) => {
    const data = db.get(jmeno);

    data.jmeno = jmeno;

    return data;
}

exports.spravneHeslo = (jmeno, heslo) => {
    const uzivatel = db.get(jmeno);

    return bcrypt.compareSync(heslo, uzivatel.heslo);
}
