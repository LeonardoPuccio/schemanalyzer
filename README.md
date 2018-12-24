# schemanalyzer
_Frequency analyzer of the schema.org classes in nodejs_

A scopo dimostrativo l'app permette di caricare una lista di siti dal file [sitelist.csv](https://github.com/LeonardoPuccio/schemanalyzer/blob/master/input_data/sitelist.csv), per ogni sito verrà scaricato l'HTML e fatto un parsing per conteggiare tutte le classi schema.org per ogni formato (microdata, rdfa, json-ld).

Il parsing restituisce un oggetto json di questo tipo:
```json
{
  "microdata": {
    "Product": [
      {
        "@context": "http://schema.org/",
        "@type": "Product",
        "brand": "ACME",
        "name": "Executive Anvil",
        "image": "anvil_executive.jpg",
        "description": "Sleeker than ACME's Classic Anvil, the\n    Executive Anvil is perfect for the business traveler\n    looking for something to drop from a height.",
        "mpn": "925872",
        "aggregateRating": {
          "@context": "http://schema.org/",
          "@type": "AggregateRating",
          "ratingValue": "4.4",
          "reviewCount": "89"
        },
        "offers": {
          "@context": "http://schema.org/",
          "@type": "Offer",
          "priceCurrency": "USD",
          "price": "119.99",
          "priceValidUntil": "5 November!",
          "seller": {
            "@context": "http://schema.org/",
            "@type": "Organization",
            "name": "Executive Objects"
          },
          "itemCondition": "http://schema.org/UsedCondition",
          "availability": "http://schema.org/InStock"
        }
      }
    ]
  },
  "rdfa": {},
  "jsonld": {},
  "metatags": {
    "priceCurrency": [
      "USD",
      "USD"
    ]
  }
}
```
_Per approfondimenti vedi [References](https://github.com/LeonardoPuccio/schemanalyzer#references)_

Mentre l'output dell'app restituisce un json cumulativo con la somma di tutte le classi così formato:
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
dove `type` rappresenta la classe schema.org e `value` la somma delle occorrenze.

## Test Prototipo

### Prerequisiti
##### - [nodejs](https://nodejs.org/)
##### - [Git](https://git-scm.com/downloads) _OPZIONALE_

### Installazione dipendenze

_Da terminale o prompt dei comandi_
```
$ git clone https://github.com/LeonardoPuccio/schemanalyzer.git schemanalyzer
$ cd schemanalyzer
$ npm install
```

> git è opzionale. È sufficiente scaricare il repository ed estrarlo in una cartella qualsiasi, dalla quale eseguiremo `npm install`

### Avvio
```
$ node schemanalyzer
```

## Serpanalyzer

l'App SERP Analyzer viene eseguita in modo schedulato 3 volte al giorno (6:00, 14:00, 22:00 ora italiana) ed è ospitata sui server [Heroku](https://github.com/LeonardoPuccio/schemanalyzer#references). Di seguito alcuni dettagli del suo funzionamento.

L'app prende in input un file json così composto:

```json
{
  "dominio 1": [
    "keyword 1",
    "keyword 2",
    ...
  ],
  "dominio 2": [
    "keyword 1",
    "keyword 2",
    ...
  ],
  ...
}
```

e restituisce un json di questo tipo:

```json
{
  "dominio 1": {
    "keyword 1": {
      "google": "posizione (int)",
      "bing": "posizione (int)",
      "yahoo": "posizione (int)"
    },
    "keyword 2": {
      "google": 28,
      "bing": 24,
      "yahoo": 25
    }
  },
  "dominio 2": {
    "keyword 1": {
      "google": 1,
      "bing": 1,
      "yahoo": 1
    }
  }
}
```

dove `dominio` e `keyword` rappresentano il dominio  e la parola chiave per la quale effettuare l'analisi.

l'analisi viene eseguita su google, bing e yahoo.
Di seguito la lista di parametri che è possibile configurare ad esempio nel caso di google (con i valori di default):

```obj
{
  baseURL: 'https://www.google.it',
  timeout: 10000,
  params: {
    q: keyword,
    num: 30,
    Ulteriori parametri
    hl: 'it',         // lingua interfaccia utente
    cr: 'countryIT',  // risultati originari di un determinato paese
    lr: 'lang_it',    // risultati scritti in una particolare lingua (non molto efficace)
    gl: 'it',         // geolocalizzazione utente finale
    filter: 0         // filtro risultati duplicati (0 mostra i risultati)
  },
  headers: {
    "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
  }
}
```

I risultati dell'analisi vengono salvati in un database [mongodb remoto](https://cloud.mongodb.com), l'URI per la connessione vi verrà inviato in privato nel caso vogliate avere accesso.

Il db è composto da una collezione di `measurements` così formati:
```json
{
  "_id": "ID",
  "timestamp": "data ($date)",
  "domains": [
    {
      "domain": "www.dominio1.it",
      "keywords": [
        {
          "keyword": "Keyword1",
          "measurement": {
            "google": "posizione ($numberInt)",
            "bing": "posizione ($numberInt)",
            "yahoo": "posizione ($numberInt)"
          }
        },
        {
          "keyword": "Keyword2",
          "measurement": {
            "google": "posizione ($numberInt)",
            "bing": "posizione ($numberInt)",
            "yahoo": "posizione ($numberInt)"
          }
        }
      ]
    },
    {
      "domain": "www.dominio2.com",
      "keywords": [
        {
          "keyword": "Keyword1",
          "measurement": {
            "google": "posizione ($numberInt)",
            "bing": "posizione ($numberInt)",
            "yahoo": "posizione ($numberInt)"
          }
        }
      ]
    }
  ]
}
```

### References

* [schema.org](https://schema.org/) - Schemas for structured data on the Internet.
* [NodeJS](https://nodejs.org/en/about/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
* [node-fetch](https://github.com/bitinn/node-fetch) - Promise based HTTP client for the browser and node.js.
* [Web Auto Extractor](https://github.com/indix/web-auto-extractor) - Parse semantically structured information from any HTML webpage.
* [cheerio](https://github.com/cheeriojs/cheerio) - Implementation of core jQuery designed specifically for the server.
* [Mongoose](https://github.com/cheeriojs/cheerio) - Mongoose is a [MongoDB](https://www.mongodb.com/) object modeling tool designed to work in an asynchronous environment.
* [Heroku](https://www.heroku.com/platform) - Heroku is a container-based cloud Platform as a Service (PaaS)
