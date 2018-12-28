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

## Test Prototipo schemanalyzer

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

### Input/Output e parametri

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
Di seguito un esempio di parametri che è possibile configurare nel caso di google (con i valori di default):

```obj
baseURL: 'https://www.google.it',
params: {
  num: 30,
  hl: 'it',         // lingua interfaccia utente
  cr: 'countryIT',  // risultati originari di un determinato paese
  gl: 'it',         // geolocalizzazione utente finale
  filter: 0         // filtro risultati duplicati (0 mostra i risultati)
}
```
I parametri al completo sono presenti nel file [serpAnalyzerOptions.js](https://github.com/LeonardoPuccio/schemanalyzer/blob/master/config/serpAnalyzerOptions.js).

### Database

I risultati dell'analisi vengono salvati in un database [mongodb remoto](https://cloud.mongodb.com).

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

### Esecuzione serpanalyzer in locale

Prerequisiti e dipendenze sono in comune con lo schemanalyzer, dunque qualora non sia già stato fatto è possibile seguire le medesime istruzioni nel caso si voglia eseguire il serpanalyzer localmente.

#### Nozioni preliminari

Il serpanalyzer si avvale di 2 variabili d'ambiente:

| Nome | Valore | Descrizione |
| ------ | ------ | ------ |
| `URI_MONGODB` | `string` | l'URI per la connessione al database mongodb |
| `INSERT_DB` | `string` (solo `true` o `false`) | determina se il risultato dell'analisi debba essere inserito o meno nel database |

la versione live dell'app ha assegnate le variabili in uno spazio dedicato sul server, nel caso l'app debba essere avviata localmente dovranno essere assegnate localmente.
È possibile assegnare tali variabili in svariati modi che possono dipendere dal sistema operativo, dall'editor di testo in uso, dall'ambiente di sviluppo.
Le istruzioni di avvio tengono conto dei metodi più generici.

#### Avvio

##### Windows
```
$ set URI_MONGODB=<value>
$ set INSERT_DB=<value>
$ node serpalyzer-local
```

##### Linux
```
$ URI_MONGODB=<value> INSERT_DB=<value> node serpalyzer-local
```

### References

* [schema.org](https://schema.org/) - Schemas for structured data on the Internet.
* [NodeJS](https://nodejs.org/en/about/) - JavaScript runtime built on Chrome's V8 JavaScript engine.
* [MongoDB](https://www.mongodb.com/) - MongoDB is an open-source document database that provides high performance, high availability, and automatic scaling.
* [Heroku](https://www.heroku.com/platform) - Heroku is a container-based cloud Platform as a Service (PaaS)
* [Mongoose](https://github.com/cheeriojs/cheerio) - Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment.
* [node-fetch](https://github.com/bitinn/node-fetch) - Promise based HTTP client for the browser and node.js.
* [Web Auto Extractor](https://github.com/indix/web-auto-extractor) - Parse semantically structured information from any HTML webpage.
* [cheerio](https://github.com/cheeriojs/cheerio) - Implementation of core jQuery designed specifically for the server.
