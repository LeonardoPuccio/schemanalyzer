/**
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.1.0
 */
const fs        = require('fs');
const readline  = require('readline');
const axios     = require('axios');
const cheerio   = require('cheerio');
const url       = require('url');

const rl = readline.createInterface({
  input: fs.createReadStream('serpsitelist-other_method.csv'),
  crlfDelay: Infinity
});
let serpList = [];
// let params = {
//   host: 'www.google.it',
//   device: 'desktop',
//   lang: 'it',
//   results: '10',
//   filter: '0' // mostra risultati omessi
// }

rl.on('line', (line) => {
  serpList.push(line);
});
rl.on('close', () => {
  splitArrayRow(serpList);
});

function splitArrayRow(serpList){
  let serpArray = serpList.map((serpLine, i) => {
    // DEBUG OK
    // console.log('siteUrl: ' + serpLine + ', i: ' + i);
    return serpLine.split(",");
  });
  // DEBUG OK
  // console.log('serpArray[0]: ' + serpArray[0] + ', serpArray[1]: ' + serpArray[1]);
  getSerp(serpArray);
}

function getSerp(serpArray){
  console.log('Check started... Takes some time...')
  let resultsArray = []
  let resultsJson = {}
  let axiosPromises = serpArray.map((serpLine, i) => {
    // DEBUG
    // console.log('serpLine[0]: ' + serpLine[0] + ', serpLine[1]: ' + serpLine[1] + ', i: ' + i);
    return axios.get('/search', {
      baseURL: 'https://www.google.it',
      timeout: 10000,
      params: {
        q: serpLine[1],
        num: 10,
        filter: 1,
      }
    });
  });
  axios
  .all(axiosPromises)
  .then((responses) => {
    responses.forEach((response, i) => {
      // DEBUG OK
      // console.log('Success: ' + i)
      resultsArray.push(findPosition(response, serpArray[i]));
      resultsJson[url.parse(serpArray[i][0]).hostname] = resultsArray;
      sleep((Math.floor(Math.random() * 8)) + 3); // Attendo casualmente dai 3 ai 10 secondi
    })
    console.log('submitted all axios calls');
    console.log(resultsJson);
  })
  .catch(error => {
    // handle error
    console.log(error);
  })
}

function findPosition(response, serpLine){
  let $ = cheerio.load(response.data);
  let parsedHost = url.parse(serpLine[0]).hostname
  let parsedKeyword = serpLine[1]

  let temp = {}
  $('#search .g h3 > a').each( (j, el) => {
    let elHref = url.parse(el.attribs.href, true).query.q;
    let elHost = url.parse(elHref).hostname

    // console.log('elHref: ' + elHref + ', elHost: ' + elHost + ', parsedHost: ' + parsedHost + ';\ni: ' + i + ', j: ' + j);
    if (parsedHost == elHost){
      // console.log('elHref: ' + elHref + ', elHost: ' + elHost + ', parsedHost: ' + parsedHost + ';\ni: ' + i + ', j: ' + j);
      temp[parsedKeyword] = j + 1;
    }
  });
  if (!temp[parsedKeyword]) temp[parsedKeyword] = 0;
  return temp;
}

function msleep(n) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n);
}
function sleep(n) {
  msleep(n*1000);
}
