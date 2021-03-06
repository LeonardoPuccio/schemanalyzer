/**
 * @fileOverview Frequency analyzer of the schema.org types.
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.4.0
 */
const fs              = require('fs');
const WAE             = require('web-auto-extractor').default

/**
 * AbortController for terminating fetch() requests
 * More details:
 * - https://github.com/mo/abortcontroller-polyfill#using-it-on-nodejs
 * - https://developers.google.com/web/updates/2017/09/abortable-fetch
 */
const { AbortController, abortableFetch } = require('abortcontroller-polyfill/dist/cjs-ponyfill');
const _nodeFetch = require('node-fetch');
const { fetch, Request } = abortableFetch({fetch: _nodeFetch, Request: _nodeFetch.Request});

const serpOptions     = require('./config/serpAnalyzerOptions');
const insertUrlsToDB  = require('./utils/insertUrlsToDB').insertUrlsToDB;
const urlsJson        = JSON.parse(fs.readFileSync('./input_data/urlsToCheck.json', 'utf8'));
const formats         = ['jsonld', 'microdata', 'rdfa'];
let results           = [];

getAllStructuredData()
  .then(() => {
    console.log("end of getAllStructuredData()");
    insertUrlsToDB(results);
  })
  .catch(error => {
    console.log('* Error in getAllStructuredData() *\n- results: ' + JSON.stringify(results));
    console.log(error);
  })

async function getAllStructuredData() {
  let counter = 0;
  for (urlObj of urlsJson){
    // workaround per strutture molto grandi
    if (counter == 1000){
      counter = 0;
      insertUrlsToDB(results);
      results = [];
    }
    console.log('Analysis for source: ' + urlObj.source + ', keyword: ' + urlObj.keyword + ', url: ' + urlObj.url);
    let data = await fetchRequest(urlObj.url, serpOptions.default, 3);
    if (!data) continue;
    let parsed;
    try {
      parsed = WAE().parse(data);
    } catch(err) {
      console.log('* Error in parse() *\n- url: ' + urlObj.url);
      console.log(err);
      parsed = null;
      continue;
    }
    enrichData(parsed, urlObj.url, urlObj);
    counter++;
  }
}

function enrichData(parsed, url, obj){
  if (parsed){
    delete parsed.metatags;
    parsed.url = url;
    parsed.position = obj.position;
    parsed.source = obj.source;
    parsed.keyword = obj.keyword;
    parsed.formats = {}
    parsed.types = {};
    parsed.countTypes = 0;
    for(format of formats){
      if (Object.keys(parsed[format]).length){
        parsed.formats[format] = Object.keys(parsed[format]).length;
      } else {
        parsed.formats[format] = 0;
      }
      parsed.formats[format] = Object.keys(parsed[format]).length;
      for(type of Object.keys(parsed[format])){
        if (!parsed.types[type])
          parsed.types[type] = 0;
        parsed.countTypes += Object.keys(parsed[format][type]).length;
        parsed.types[type] += parsed[format][type].length;
        // Cancello il contenuto reale degli attributi e lascio solo il numero di elementi
        let tmp = parsed[format][type].length;
        delete parsed[format][type]
        parsed[format][type] = tmp;
      }
    }
    results.push(parsed);
  }
}

async function fetchRequest(urlSearch, serpOptionsDefault, retries){
  const controller = new AbortController();
  const signal = controller.signal;
  serpOptionsDefault.signal = signal;
  try {
    let response = await fetch(urlSearch, serpOptionsDefault);
    let innerHTML = await response.text();
    return innerHTML;
  } catch(err) {
    if (retries === 1) return null;
    if (err.type === 'request-timeout' || err.type === 'body-timeout'){
      console.log('\n' + err.type + ' - ' + (--retries) + ' attempts left\n* retry in 10 seconds *');
      sleep(10);
      return await fetchRequest(urlSearch, serpOptionsDefault, retries);
    } else {
      console.log('* Error in fetchRequest() *\n- url (urlSearch): ' + urlSearch);
      console.log(err);
      return null;
    }
  } finally {
    if (controller) controller.abort();
  }
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
