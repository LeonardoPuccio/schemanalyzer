/**
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.1.1
 */
const fs      = require('fs');
const axios   = require('axios');
const cheerio = require('cheerio');
const url     = require('url');

let serpList = JSON.parse(fs.readFileSync('checkSerpList.json', 'utf8'));

console.log('Analysis started...')
getSerpChecked(serpList)

function getSerpChecked(serpList){
  let resultsJson = {}
  let tempPromises = [];
  let promisesDomains = {}

  let promises = Object.keys(serpList).map((serpUrl, i) => {
    let promisesKeyword = [];
    let domain = serpList[serpUrl].map(keyword => {
      let promise = axios.get('/search', {
        baseURL: 'https://www.google.it',
        timeout: 10000,
        params: {
          q: keyword,
          num: 15,
          // Ulteriori parametri
          // hl: 'it',         // lingua interfaccia utente
          // cr: 'countryIT',  // risultati originari di un determinato paese
          // lr: 'lang_it',    // risultati scritti in una particolare lingua (non molto efficace)
          // gl: 'it',         // geolocalizzazione utente finale
          // filter: 0         // filtro risultati duplicati (0 mostra i risultati)
        },
        headers: {
          "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
        },
        serpDomain: serpUrl
      });
      tempPromises.push(promise);
      promisesKeyword.push(promise);
    });
    promisesDomains[serpUrl] = promisesKeyword;
  });

  axios.all(tempPromises)
  .then((allResponses) => {
    Object.keys(promisesDomains).map(promisesDomain => {
      let resultsArray = [];
      promisesDomains[promisesDomain].map((promiseKeyword, i) => {
        promiseKeyword.then(result => {
          let keyword = result.config.params.q;
          let domainhostname = url.parse(result.config.serpDomain).hostname;

          resultsArray.push(findPosition(result, domainhostname, keyword));
          resultsJson[domainhostname] = resultsArray;

          sleep((Math.floor(Math.random() * 8)) + 3); // Attendo casualmente dai 3 ai 10 secondi
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

function findPosition(response, domainhostname, keyword){
  let $ = cheerio.load(response.data);
  let temp = {};
  console.log('Analysis\ndomainhostname: ' + domainhostname + ', keyword: ' + keyword);
  $('#search .g .rc > .r > a:first-of-type').each( (i, el) => {
    let elhostname = url.parse(el.attribs.href).hostname;
    if (domainhostname == elhostname ){
      console.log('Found\ndomainhostname: ' + domainhostname + ', elhostname: ' + elhostname + ', i: ' + i);
      temp[keyword] = i + 1;
    }
  });
  if (!temp[keyword]) temp[keyword] = 0;
  return temp;
}

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
  msleep(n*1000);
}
