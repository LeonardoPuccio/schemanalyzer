/**
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.3.1
 */
const fs      = require('fs');
const fetch   = require('node-fetch');
const url     = require('url');
const cheerio = require('cheerio');

const serpOptions   = require('../config/serpAnalyzerOptions');
const keywordsJson  = JSON.parse(fs.readFileSync('./input_data/keywordsToGetUrls.json', 'utf8'));
let lang = 'en';
let searchEngine = 'https://www.google.com';
let results = [];

console.log('\nAnalysis started... It can take a few minutes\n');
getAllSerpResult()
  .then(() => {
    fs.writeFileSync('./input_data/urlsToCheck.json', JSON.stringify(results));
    console.log("File was saved!");
  })
  .catch(error => {
    console.log("Error in getAllSerpResult()");
    console.log(error);
  })

async function getAllSerpResult() {
  for (keywordsGroup in keywordsJson){
    if (keywordsGroup === 'Italy'){
      lang = 'it';
      searchEngine = 'https://www.google.it';
    }
    for (keyword of keywordsJson[keywordsGroup]){
      console.log('Analysis for ' + keyword);
      let urlSearch = url.parse(searchEngine, true)
      let options = {
        protocol: urlSearch.protocol,
        hostname: urlSearch.hostname,
        pathname: '/search',
        query: {
          num: 100,
          hl: lang,             // lingua interfaccia utente
          gl: lang,             // geolocalizzazione utente finale
          filter: 0,            // filtro risultati duplicati (0 mostra i risultati)
          // cr: 'countryIT',   // risultati originari di un determinato paese
          // lr: 'lang_it',     // risultati scritti in una particolare lingua (non molto efficace)
          // more info: https://developers.google.com/custom-search/v1/cse/list
        }
      };
      options.query.q = keyword;
      urlSearch = url.format(options);

      msleep(getRandomIntInclusive(2000, 3000)); // Attendo casualmente da 2000 a 3000 ms
      let data = await fetchRequest(urlSearch, serpOptions.default, 3);
      let response = await data.text();
      console.log(data.statusText);

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
    sleep(5);
    return await fetchRequest(urlSearch, serpOptionsDefault, retries--);
  }
}

function scraper(response, keywordsGroup, keyword){
  // const selector = '#search .g .rc > .r > a:first-of-type';
  // const selector = '#search .srg div.r > a:first-of-type';
  const selector = '#rso > div > div > div > div > div > div.r > a:first-of-type, #rso > div > div > div > div > div.r > a:first-of-type, #rso div.r > h3 > g-link > a';
  let $ = cheerio.load(response);

  $(selector).each( (i, el) => {
    results.push({
      url: el.attribs.href,
      position: ++i,
      source: keywordsGroup,
      keyword: keyword
    });
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
