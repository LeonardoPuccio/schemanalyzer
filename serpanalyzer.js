/**
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.3.0
 */
const fs      = require('fs');
const fetch   = require('node-fetch');
const url     = require('url');
const cheerio = require('cheerio');

const serpOptions = require('./config/serpAnalyzerOptions');
const insertToDB  = require('./utils/insertToDB').insertToDB;
const serpList    = JSON.parse(fs.readFileSync('./input_data/checkSerpList.json', 'utf8'));

function serpAnalyzer(){
  console.log('\nAnalysis started... It can take a few minutes');
  getAllSerpResult()
    .then((resultsJson) => {
      console.log("json result:\n" + JSON.stringify(resultsJson));
      console.log("\nInsert to DB...");
      insertToDB(resultsJson);
    })
    .catch(error => {
      console.log("Error in getAllSerpResult()");
      console.log(error);
    })
}

async function getAllSerpResult() {
  let resultsJson = {};

  for(let domain in serpList){
    let domainHostname = url.parse(domain).hostname;
    console.log('\n* Domain: ' + domainHostname + ' *');
    resultsJson[domainHostname] = {};

    for(let i in serpList[domain]){
      let keyword = serpList[domain][i];
      console.log('- keyword: ' + keyword);
      resultsJson[domainHostname][keyword] = {};

      for (let searchengine in serpOptions){
        if (searchengine != 'default'){
          console.log('Analysis for ' + searchengine);
          let urlSearch = url.parse(serpOptions[searchengine].baseURL, true)
          let options = {
            protocol: urlSearch.protocol,
            hostname: urlSearch.hostname,
            pathname: '/search',
            query: serpOptions[searchengine].params
          };
          options.query.q = keyword;
          urlSearch = url.format(options);

          msleep(getRandomIntInclusive(1000, 3000)); // Attendo casualmente da 1000 a 2000 ms

          let data = await fetch(urlSearch, serpOptions.default);
          // workaround per non usare un proxy
          while ( data.status == 999 ) {
            console.log("\nerror 999\n* retry in 240 seconds *");
            // attesa di 180 secondi piuttosto che inviare richieste su yahoo ogni minuto
            sleep(240);
            data = await fetch(urlSearch, serpOptions.default);
          }

          let response = await data.text();

          let position = scraper(response, domainHostname, searchengine);
          resultsJson[domainHostname][keyword][searchengine] = position;
        }
      }
      console.log();
    }
  }

  return resultsJson;
}

function scraper(response, domainHostname, searchengine){
  const selector = {
    google: '#search .g .rc > .r > a:first-of-type',
    bing: '.b_algo > h2 > a',
    yahoo: '#web > ol > li h3 > a.ac-algo.fz-l.ac-21th.lh-24'
  };
  let $ = cheerio.load(response);
  let position = 0;

  $(selector[searchengine]).each( (i, el) => {
    let elHref = el.attribs.href;
    if (searchengine == 'yahoo' && url.parse(elHref).hostname == "r.search.yahoo.com") elHref = parseYahooHref(elHref);
    let elhostname = url.parse(elHref).hostname;

    if (domainHostname == elhostname){
      console.log('Found at position: ' + (i + 1));
      position = i + 1;
      return false;
    }
  });

  if (position == 0) console.log('Not Found');
  return position;
}

function parseYahooHref(yahooHref){
  let regex = /RU=(.*)\/RK/g;
  let found = regex.exec(yahooHref);
  return decodeURIComponent(found[1]);
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

module.exports = {
  start: serpAnalyzer
};
