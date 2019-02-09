/**
 * @fileOverview Frequency analyzer of the schema.org types.
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.2.0
 */
const fs              = require('fs');
const fetch           = require('node-fetch');
const WAE             = require('web-auto-extractor').default

const serpOptions     = require('./config/serpAnalyzerOptions');
const insertUrlsToDB  = require('./utils/insertUrlsToDB').insertUrlsToDB;
const urlsJson        = JSON.parse(fs.readFileSync('./input_data/urlsToCheck.json', 'utf8'));
const formats         = ['jsonld', 'microdata', 'rdfa'];
let resultJson        = [];

getAllStructuredData()
  .then(() => {
    console.log("end of getAllStructuredData()");
    // console.log(JSON.stringify(resultJson));
    insertUrlsToDB(resultJson);
    // if (process.env.INSERT_DB === 'true'){
    //   console.log("\nInsert to DB...");
    //   insertMeasurementsToDB(resultsJson);
    // }
  })
  .catch(error => {
    console.log('* Error in getAllStructuredData() *\n- resultJson: ' + resultJson);
    console.log(error);
  })

async function getAllStructuredData() {
  for (url of Object.keys(urlsJson)){
    console.log('Analysis for ' + url);
    // msleep(getRandomIntInclusive(1000, 2000)); // Attendo casualmente da 1000 a 2000 ms
    let data = await fetchRequest(url, serpOptions.default, 5);
    if (!data) {
      continue;
    }
    let response = await data.text();
    let parsed;
    try {
      parsed = WAE().parse(response);
    } catch(err) {
      console.log('* Error in parse() *\n- url: ' + url);
      console.log(err);
      parsed = null;
      continue;
    }
    enrichData(parsed, url, urlsJson[url]);
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
      }
    }
    resultJson.push(parsed);
  }
}

async function fetchRequest(urlSearch, serpOptionsDefault, retries){
  try {
    return await fetch(urlSearch, serpOptionsDefault);
  } catch(err) {
    if (retries === 1) return null;
    if (err.type == 'request-timeout' ){
      console.log('\nrequest-timeout - ' + (--retries) + ' attempts left\n* retry in 10 seconds *');
      sleep(10);
      return await fetchRequest(urlSearch, serpOptionsDefault, retries);
    } else {
      console.log('* Error in fetchRequest() *\n- url (urlSearch): ' + urlSearch);
      console.log(err);
      --retries;
    }
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
