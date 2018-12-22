/**
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.2.0
 */
const fs      = require('fs');
const axios   = require('axios');
const url     = require('url');
const cheerio = require('cheerio');

const serpOptions = require('./config/serpAnalyzerOptions');
const instance = axios.create(serpOptions.default);

const serpList = JSON.parse(fs.readFileSync('./input_data/checkSerpList.json', 'utf8'));

console.log('Analysis started... It can take a few minutes');

getAllSerpResult()
  .then((resultsJson) => {
    console.log("json result:\n" + JSON.stringify(resultsJson));
  })
  .catch(error => {
    console.log("Error in getAllSerpResult()");
    console.log(error);
  })

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
          let options = {
            baseURL: serpOptions[searchengine].baseURL,
            params: {},
            serpDomain: domainHostname
          };
          for(var param in serpOptions[searchengine].params) options.params[param] = serpOptions[searchengine].params[param];
          options.params.q = keyword;
          // if ( searchengine != "yahoo" ) options.params.q = keyword;
          //
          // if ( searchengine == "yahoo" ) {
          //   options.params.p = keyword;
          //   options.params.vs = '';
          //   msleep(getRandomIntInclusive(10000, 30000));
          //   const userAgents = [
          //     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36",
          //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
          //     "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36",
          //     "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36",
          //     "Mozilla/5.0 (Windows NT 5.1; rv:7.0.1) Gecko/20100101 Firefox/7.0.1",
          //     "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:54.0) Gecko/20100101 Firefox/54.0",
          //     "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1"
          //   ]
          //
          //   let randUserAgent = userAgents[Math.random() * userAgents.length | 0]
          //
          //   options.withCredentials = true;
          //   // options.headers = {
          //   //   "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
          //   //   "accept-encoding": " gzip, deflate, br",
          //   //   "accept-language": "it,en-US;q=0.9,en;q=0.8",
          //   //   "cookie": "GUC=AQABAQFcHPVdBUIb5ARY&s=AQAAAMYiGXa7&g=XBupuw; B=093ks9te1nadg&b=3&s=mk; ymuid=v=10AC97EA9D696ED408659B2C9C026F71&ts=1545319261",
          //   //   "upgrade-insecure-requests": 1,
          //   //   // "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36"
          //   // }
          //   options.headers = {}
          //   options.headers["user-agent"] = randUserAgent;
          // }
          // else msleep(getRandomIntInclusive(1000, 3000)); // Attendo casualmente da 1000 a 3000 ms
          msleep(getRandomIntInclusive(1000, 3000)); // Attendo casualmente da 1000 a 3000 ms
          response = await instance.get('/search', options);

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
  let $ = cheerio.load(response.data);
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
