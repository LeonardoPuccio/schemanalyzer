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

## WIP

Il SERP checker è ancora un work in progress, ci sono 2 versioni, una

```json
{
  "dominio 1": [
    "key 1",
    "key 2",
    ...
  ],
  "dominio 2": [
    "key 1",
    "key 2",
    ...
  ],
  ...
}
```
