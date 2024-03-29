# Učitelské hlášky SPŠ Trutnov
- Cílem kvízu je otestovat Vaší znalost učitelů na SPŠ Trutnov a jejich hlášek.
- Projekt obsahuje dva kvízy
  - Bodovaný kvíz na % úspěšnosti
  - Náhlá smrt
- Registrování je možné **jen** přes školní email
- Registrovaní uživatelé mají možnost ukládat své oblíbené hlášky a také se zapsat do síňě slávy


### Spuštění projektu
- Projekt běží na [Node.js](https://nodejs.org/), po instalaci Nodu je potřeba instalovat závislosti do `/src/citaty` příkazem `npm install` v terminálu
- Také je potřeba vytvořit soubor ".env" v `/src/citaty` a do něj definovat PORT, SECRET a APIHESLO.
- Formát .env: 
  - PORT = 64000
  - SECRET = "Dlouhý náhodný string"
  - APIHESLO = "heslo od google mail api"
- Api heslo můžete dostat takto:
  - 1. Ve svém gmail účtu povolte 2FA.
  - 2. Jděte na  [App passwords](https://myaccount.google.com/u/1/apppasswords)
  - 3. V app passwords si vytvořte novou aplikaci kde aplikace bude typu Other. Aplikaci si pojmenujte libovolně.
- Poté stačí do stejného terminálu zadat příkaz `npm run dev`
- Projekt bude dostupný na adrese [localhost:8000](http://localhost:8000)
