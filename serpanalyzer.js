/**
 * @author Leonardo Puccio <puccio.leonardo@gmail.com>
 * @version 0.1.0
 */
const fs        = require('fs');
// const readline  = require('readline');
const axios     = require('axios');
const cheerio   = require('cheerio');
const url       = require('url');

// const rl = readline.createInterface({
//   input: fs.createReadStream('serpsitelist.csv'),
//   crlfDelay: Infinity
// });
// let serpList = [];
// // let params = {
// //   host: 'www.google.it',
// //   device: 'desktop',
// //   lang: 'it',
// //   results: '10',
// //   filter: '0' // mostra risultati omessi
// // }
//
// rl.on('line', (line) => {
//   serpList.push(line);
// });
// rl.on('close', () => {
//   splitArrayRow(serpList);
// });
//
// function splitArrayRow(serpList){
//   let serpArray = serpList.map((serpUrl, i) => {
//     // DEBUG OK
//     // console.log('siteUrl: ' + serpUrl + ', i: ' + i);
//     return serpUrl.split(",");
//   });
//   // DEBUG OK
//   // console.log('serpArray[0]: ' + serpArray[0] + ', serpArray[1]: ' + serpArray[1]);
//   getSerp(serpArray);
// }

// let serpList = {}
// fs.readFile('checkSerpList.json', 'utf8', function (err, data) {
//   if (err) throw err;
//   // getSerp(JSON.parse(data));
// });

let serpList = JSON.parse(fs.readFileSync('checkSerpList.json', 'utf8'));
// DEBUG OK
// console.log(JSON.stringify(serpList));

getSerpChecked(serpList)

function getSerpChecked(serpList){
  let resultsArray = []
  let resultsJson = {}
  Object.keys(serpList).map(serpUrl => {
    // console.log(serpUrl);
    let axiosPromises = serpList[serpUrl].map(keyword => {
      console.log('**GET**');
      return axios.get('/search', {
        baseURL: 'https://www.google.it',
        timeout: 10000,
        params: {
          q: keyword,
          num: 10,
          filter: 1,
        }
      });
    });
    axios
    .all(axiosPromises)
    .then((responses) => {
      responses.forEach((response, i) => {
        let keyword = response.config.params.q;
        let domain = url.parse(serpUrl).hostname;
        // DEBUG
        console.log('Success: ' + i + ', domain: ' + domain + ', keyword: ' + keyword);
        resultsArray.push(findPosition(response, domain, keyword));
        console.log('resultsArray: ' + JSON.stringify(resultsArray));
        resultsJson[domain] = resultsArray;
        sleep((Math.floor(Math.random() * 8)) + 3); // Attendo casualmente dai 3 ai 10 secondi
      })
      console.log('submitted all axios calls');
      console.log(resultsJson);
    })
    .catch(error => {
      // handle error
      console.log(error);
    })
  });
}

function findPosition(response, domain, keyword){
  let $ = cheerio.load(response.data);
  // let domain = url.parse(domain).hostname

  let temp = {}
  $('#search .g h3 > a').each( (j, el) => {
    let elHref = url.parse(el.attribs.href, true).query.q;
    let elHost = url.parse(elHref).hostname

    // console.log('elHref: ' + elHref + ', elHost: ' + elHost + ', domain: ' + domain + ';\ni: ' + i + ', j: ' + j);
    if (domain == elHost){
      // console.log('elHref: ' + elHref + ', elHost: ' + elHost + ', domain: ' + domain + ';\ni: ' + i + ', j: ' + j);
      temp[keyword] = j + 1;
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
