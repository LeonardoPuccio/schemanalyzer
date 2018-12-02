/**
 * @fileOverview Frequency analyzer of the schema.org classes.
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.1.0
 */

const fs        = require('fs');
const readline  = require('readline');
const axios     = require('axios');
const WAE       = require('web-auto-extractor').default
const fij       = require('./find-in-json');

const rl = readline.createInterface({
  input: fs.createReadStream('sitelist.csv'),
  crlfDelay: Infinity
});

let siteUrls = [];

rl.on('line', (line) => {
  siteUrls.push(line)
});

rl.on('close', () => {
  getStructuredData(siteUrls);
});

async function getStructuredData(siteUrls){
  let classes = [];
  let promises = [];

  siteUrls.forEach(siteUrl => {
    promises.push(axios.get(siteUrl)
        .then(function (response) {
          // handle success
          // console.log(response);

          parsed = WAE().parse(response.data);
          // console.log(parsed);
          // console.log(JSON.stringify(parsed));
          classes.push(Object.keys(parsed));
          console.log(JSON.stringify(parsed) + ',\n\n');
          // console.log(JSON.stringify(Object.keys(parsed.metatags).length));
          // console.log('\nclasses: \n' + classes + '\n********************\n\n');

        })
        .catch(function (error) {
          // handle error
          console.log(error);
        }))
    });

  await axios.all(promises);
  console.log('FINISH: \n' + classes);
}

// // Unit Test per esplorare il json
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

// WORKING
// let promises = siteUrls.map(async siteUrl => {
//   let response = await axios.get(siteUrl)
//     .then(function (response) {
//       // handle success
//       // console.log(response);
//       parsed = WAE().parse(response.data);
//       console.log(JSON.stringify(parsed.jsonld));
//       classes.push(Object.keys(parsed.jsonld));
//       // console.log('classes: \n' + classes + '\n\n');
//
//     })
//     .catch(function (error) {
//       // handle error
//       console.log(error);
//     })
// });
