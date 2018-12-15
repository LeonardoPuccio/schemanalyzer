/**
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.1.1
 */
const fs      = require('fs');
const axios   = require('axios');
const url     = require('url');
const cheerio = require('cheerio');

const serpOptions = require('./serpAnalyzerOptions');
const resultsJson = {"google":{},"bing":{},"yahoo":{}};
const instance = axios.create(serpOptions.default);

let serpList = JSON.parse(fs.readFileSync('checkSerpList.json', 'utf8'));

console.log('Analysis started... It can take a few minutes')
for(var key in serpOptions){
  if ( key != 'default' ) getSerpChecked(serpList, key);
}

function getSerpChecked(serpList, searchengine){
  // let resultsJson = {"google":{},"bing":{},"yahoo":{}};
  let tempPromises = [];
  let promisesDomains = {}

  Object.keys(serpList).map((serpUrl, i) => {
    let promisesKeyword = [];
    serpList[serpUrl].map(keyword => {
      let options = {
        baseURL: serpOptions[searchengine].baseURL,
        params: {
          // q: keyword,
        },
        serpDomain: serpUrl
      };
      if (searchengine == 'yahoo') options.params.p = keyword;
      else options.params.q = keyword;
      for(var key in serpOptions[searchengine].params) options.params[key] = serpOptions[searchengine].params[key];

      let promise = instance.get('/search', options);

      tempPromises.push(promise);
      promisesKeyword.push(promise);

      sleep((Math.floor(Math.random() * 3)) + 1); // Attendo casualmente da 1 a 3 secondi
    });
    promisesDomains[serpUrl] = promisesKeyword;
  });

  axios.all(tempPromises)
  .then((allResponses) => {
    Object.keys(promisesDomains).map(promisesDomain => {
      let resultsArray = [];
      promisesDomains[promisesDomain].map((promiseKeyword, i) => {
        promiseKeyword.then(result => {
          // DEBUG
          // console.log(result.data);
          // let keyword = result.config.params.q;
          let keyword;
          if (searchengine == 'yahoo') keyword = result.config.params.p;
          else keyword = result.config.params.q;
          let domainhostname = url.parse(result.config.serpDomain).hostname;

          resultsArray.push(scraper(result, domainhostname, keyword, searchengine));
          resultsJson[searchengine][domainhostname] = resultsArray;

          // Spostato
          // sleep((Math.floor(Math.random() * 8)) + 3); // Attendo casualmente dai 3 ai 10 secondi
        })
      })
    })
  })
  .catch(error => {
    // handle error
    console.log(error);
  })
  .then(() => {
    console.log('submitted all axios calls');
    console.log(JSON.stringify(resultsJson));
  })

}

function scraper(response, domainhostname, keyword, searchengine){
  const selector = {
    google: '#search .g .rc > .r > a:first-of-type',
    bing: '.b_algo > h2 > a',
    yahoo: '#web > ol > li h3 > a.ac-algo.fz-l.ac-21th.lh-24'
  };
  let $ = cheerio.load(response.data);
  let temp = {};
  console.log('Analysis\nWebsite: ' + domainhostname + ', Keyword: ' + keyword);
  $(selector[searchengine]).each( (i, el) => {
    // let elhostname = url.parse(el.attribs.href).hostname;
    let elHref = el.attribs.href;
    if (searchengine == 'yahoo') elHref = parseYahooHref(elHref);
    let elhostname = url.parse(elHref).hostname;

    if (domainhostname == elhostname ){
      console.log('Found at position: ' + (i + 1));
      temp[keyword] = i + 1;
      return false;
    }
  });
  if (!temp[keyword]) temp[keyword] = 0;
  return temp;
}

function parseYahooHref(yahooHref){
  // console.log( 'yahooHref: ' + yahooHref );
  let regex = /RU=(.*)\/RK/g;
  let found = regex.exec(yahooHref);
  // console.log( 'url: ' + found[1] );
  // console.log( 'decodeURIComponent(found[1]): ' + decodeURIComponent(found[1]) );
  // console.log();
  return decodeURIComponent(found[1]);
}

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
  msleep(n*1000);
}
