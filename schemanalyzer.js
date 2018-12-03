/**
 * @fileOverview Frequency analyzer of the schema.org types.
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.1.0
 */
const fs        = require('fs');
const readline  = require('readline');
const axios     = require('axios');
const WAE       = require('web-auto-extractor').default
// const fij       = require('./find-in-json'); // Vedi #Unit-Test
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
    "metatags": {},
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
    Object.keys(parsed[format]).forEach(type => {

      // Verifico se la classe esiste e la incremento, altrimenti la aggiungo
      types[format].hasOwnProperty(type) ? types[format][type]++ : types[format][type] = 1;

      // Vecchio metodo
      // if ( fij.getValues(types, type)[0] > 0 ){
      //   // EXISTS
      //   types[format][type]++
      // } else {
      //   types[format][type] = 1;
      // }
      // ternary operator
      // ( fij.getValues(types, type)[0] > 0 ) ? types[format][type]++ : types[format][type] = 1;
    });
  });
}

// // #Unit-Test per esplorare il json ( const fij = require('./find-in-json'); )
// const schema = JSON.parse(fs.readFileSync('schema.json', 'utf8'));
// // console.log(schema);
// // console.log(fij.getValues(schema,'@type').length); // 1613
// function getClasses(){
//
//   let n = 0;
//   fij.getObjects(schema,'@type','').forEach( type => {
//     if (type['@type'] == 'rdfs:Class'){
//       console.log(type['rdfs:label']);
//       n++;
//     }
//   });
//   console.log(n);
//
// }
// getClasses();

// Metodo alternativo (più elegante) per il loop asyncrono
// let promises = siteUrls.map(async siteUrl => {
//   let response = await axios.get(siteUrl)
//     .then(function (response) {
//       // handle success
//       // console.log(response);
//       parsed = WAE().parse(response.data);
//       console.log(JSON.stringify(parsed.jsonld));
//       types.push(Object.keys(parsed.jsonld));
//       // console.log('types: \n' + types + '\n\n');
//
//     })
//     .catch(function (error) {
//       // handle error
//       console.log(error);
//     })
// });
