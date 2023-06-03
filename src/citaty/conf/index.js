const dotenv = require('dotenv');

dotenv.config();

exports.port = process.env.PORT || 8000;
exports.secret = process.env.SECRET;


exports.casVyprseniKodu = 3; // v minutách
exports.defaultJmeno = "Přihlásit se";
exports.mailApiHeslo = process.env.APIHESLO || "kleslo"; // heslo pro API je v discordu
