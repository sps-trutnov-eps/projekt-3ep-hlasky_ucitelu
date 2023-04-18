const dotenv = require('dotenv');

dotenv.config();

exports.port = process.env.PORT || 8000;
exports.secret = process.env.SECRET || "pisscret974947970213012302312398213";

exports.defaultJmeno = "Přihlásit se";
exports.mailApiHeslo = process.env.APIHESLO || "Kleslo"; // heslo pro API je v discordu