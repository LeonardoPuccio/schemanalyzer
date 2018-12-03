/**
 * @fileOverview Frequency analyzer of the schema.org types.
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.1.0
 */
const fs        = require('fs');
const readline  = require('readline');
const axios     = require('axios');
const WAE       = require('web-auto-extractor').default
const rl = readline.createInterface({
  input: fs.createReadStream('sitelist.csv'),
  crlfDelay: Infinity
});
let siteUrls = [];

rl.on('line', (line) => {
  siteUrls.push(line);
});
rl.on('close', () => {
  getStructuredData(siteUrls);
});

async function getStructuredData(siteUrls){
  let promises = [];
  let types = JSON.parse(`
  {
    "microdata": {},
    "rdfa": {},
    "jsonld": {}
  }`);

  siteUrls.forEach(siteUrl => {
    const promise = axios.get(siteUrl)
        .then(function (response) {
          // handle success
          let parsed = WAE().parse(response.data);
          assignToJson(types, parsed)
        })
        .catch(function (error) {
          // handle error
          console.log(error);
        })

    promises.push(promise);
  });

  await axios.all(promises);
  console.log('FINISH: \n' + JSON.stringify(types));
}

function assignToJson(types, parsed){
  Object.keys(parsed).forEach(format => {
    if (format != 'metatags'){
      Object.keys(parsed[format]).forEach(type => {
        // Verifico se la classe esiste e la incremento, altrimenti la aggiungo
        types[format].hasOwnProperty(type) ? types[format][type]++ : types[format][type] = 1;
      });
    }
  });
}
