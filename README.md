# schemanalyzer
_Frequency analyzer of the schema.org classes in nodejs_

A scopo dimostrativo l'app permette di caricare una lista di siti dal file [sitelist.csv](https://github.com/LeonardoPuccio/schemanalyzer/blob/master/sitelist.csv), per ogni sito verrà scaricato l'HTML e fatto un parsing per conteggiare tutte le classi schema.org per ogni formato (microdata, rdfa, json-ld).

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

### References

* [schema.org](https://schema.org/) - Schemas for structured data on the Internet.
* [NodeJS](https://nodejs.org/en/about/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
* [axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js.
* [Web Auto Extractor](https://github.com/indix/web-auto-extractor) - Parse semantically structured information from any HTML webpage.
* [cheerio](https://github.com/cheeriojs/cheerio) - Implementation of core jQuery designed specifically for the server.

### WIP

Il SERP checker è ancora un work in progress, ci sono 2 versioni, una con lo stesso meccanismo di schemanalyzer, che accetta in input un file csv, ed una versione aggiornata che accetta un file json così composto:

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
  "dominio 1": [
    {
      "keyword 1": "posizione (int)"
    },
    {
      "keyword 2": 0
    },
    ...
  ],
  "dominio 2": [
    {
      "keyword 1": 1
    }
    ...
  ]
}
```

dove `dominio` e `keyword` rappresentano il dominio (completo di protocollo) e la parola chiave per la quale effettuare l'analisi.

l'analisi attualmente viene eseguita solo su google.it questa è la lista di parametri che è possibile configurare (con i valori di default):

```obj
{
  baseURL: 'https://www.google.it',
  timeout: 10000,
  params: {
    q: keyword,
    num: 15,
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

è relativamente semplice modificare il prototipo cambiando la `baseURL` con bing e/o yahoo, la lista dei `params` e la funzione [`findPosition`](https://github.com/LeonardoPuccio/schemanalyzer/blob/master/serpanalyzer.js#L75-L88) affinchè effettui lo scraping all'interno di una pagina diversa da quella di google per la quale è attualmente pensata.
