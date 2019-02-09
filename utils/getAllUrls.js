/**
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.3.0
 */
const fs      = require('fs');
const fetch   = require('node-fetch');
const url     = require('url');
const cheerio = require('cheerio');

const serpOptions   = require('../config/serpAnalyzerOptions');
const keywordsJson  = JSON.parse(fs.readFileSync('./input_data/keywordsToGetUrls.json', 'utf8'));

let resultsJson = {};
console.log('\nAnalysis started... It can take a few minutes\n');
getAllSerpResult()
  .then(() => {
    // console.log("json result:\n" + JSON.stringify(resultsJson));
    fs.writeFileSync('./input_data/urlsToCheck.json', JSON.stringify(resultsJson));
  })
  .catch(error => {
    console.log("Error in getAllSerpResult()");
    console.log(error);
  })

async function getAllSerpResult() {
  for (keywordsGroup in keywordsJson){
    for (keyword of keywordsJson[keywordsGroup]){
      console.log('Analysis for ' + keyword);
      let urlSearch = url.parse('https://www.google.it', true)
      let options = {
        protocol: urlSearch.protocol,
        hostname: urlSearch.hostname,
        pathname: '/search',
        query: {
          num: 100,
          hl: 'it',             // lingua interfaccia utente
          gl: 'it',             // geolocalizzazione utente finale
          // cr: 'countryIT',   // risultati originari di un determinato paese
          // lr: 'lang_it',     // risultati scritti in una particolare lingua (non molto efficace)
          // more info: https://developers.google.com/custom-search/v1/cse/list
        }
      };
      options.query.q = keyword;
      urlSearch = url.format(options);

      msleep(getRandomIntInclusive(2000, 3000)); // Attendo casualmente da 2000 a 3000 ms
      let data = await fetchRequest(urlSearch, serpOptions.default, 5);
      let response = await data.text();

      scraper(response, keywordsGroup, keyword);
    }
  }
}

async function fetchRequest(urlSearch, serpOptionsDefault, retries){
  try {
    return await fetch(urlSearch, serpOptionsDefault);
  } catch(err) {
    if (retries === 1) throw err;
    console.log(err);
    retries--;
  }
}

function scraper(response, keywordsGroup, keyword){
  const selector = '#search .g .rc > .r > a:first-of-type';
  let $ = cheerio.load(response);

  $(selector).each( (i, el) => {
    let elHref = el.attribs.href;
    // let elhostname = url.parse(elHref).hostname;
    if (resultsJson[elHref]) console.log("Doppione: " + JSON.stringify(resultsJson[elHref]));
    resultsJson[elHref] = {
      position: ++i,
      source: keywordsGroup,
      keyword: keyword
    };
  });
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //Il max e il min sono inclusi
}
function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
  msleep(n*1000);
}

// module.exports = {
//   getAllUrls: getAllUrls
// };
