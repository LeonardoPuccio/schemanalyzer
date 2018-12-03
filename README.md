# schemanalyzer
_Frequency analyzer of the schema.org classes in nodejs_

L'app permette di caricare una lista di siti dal file [sitelist.csv](https://github.com/LeonardoPuccio/schemanalyzer/blob/master/sitelist.csv), per ogni sito verrà scaricato l'HTML e fatto un parsing per conteggiare tutte le classi schema.org per ogni formato (microdata, rdfa, json-ld).

Restituisce un json cumulativo con la somma di tutte le classi così formato:
```json
{
  "microdata": {
    "type": "value",
    ...
  },
  "rdfa": {...},
  "jsonld": {...}
}
```
## Prerequisiti
##### - [nodejs](https://nodejs.org/)
##### - [Git](https://git-scm.com/downloads) _OPZIONALE_

## Installazione dipendenze

_Da terminale o prompt dei comandi_
```
$ git clone https://github.com/LeonardoPuccio/schemanalyzer.git schemanalyzer
$ cd schemanalyzer
$ npm install
```

> git è opzionale. È sufficiente scaricare il repository ed estrarlo in una cartella qualsiasi, dalla quale eseguiremo `npm install`

## Avvio
```
$ node schemanalyzer
```

## References

* [schema.org](schema.org) - Schemas for structured data on the Internet.
* [NodeJS](https://nodejs.org/en/about/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
* [Web Auto Extractor](https://github.com/indix/web-auto-extractor) - Parse semantically structured information from any HTML webpage.
* [axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js
