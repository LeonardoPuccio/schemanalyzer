module.exports = {
  default: {
    timeout: 10000,
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
      // 'accept-language': 'it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7',
      // 'server': 'gws',
      // 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b2',
      // 'accept-encoding': 'gzip, deflate, br',
      // 'accept-language': 'it,en-US;q=0.9,en;q=0.8',
      // 'cache-control': 'no-cache',
      // 'pragma': 'no-cache',
      // 'upgrade-insecure-requests': '1',
    }
  },
  google: {
    baseURL: 'https://www.google.it',
    params: {
      num: 30,
      hl: 'it',             // lingua interfaccia utente
      gl: 'it',             // geolocalizzazione utente finale
      // filter: 0,            // filtro risultati duplicati (0 mostra i risultati)
      // cr: 'countryIT',   // risultati originari di un determinato paese
      // lr: 'lang_it',     // risultati scritti in una particolare lingua (non molto efficace)
      // more info: https://developers.google.com/custom-search/v1/cse/list
    }
  },
  bing: {
    baseURL: 'https://www.bing.com',
    params: {
      count: 30,
      setmkt: 'it-it',  // Il mercato da cui provengono i risultati.
      setlang: 'it',    // lingua interfaccia utente
      // cc: 'it',      // paese da cui provengono i risultati
      // more info: https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#query-parameters
    }
  },
  yahoo: {
    baseURL: 'https://it.search.yahoo.com/',
    params: {
      n: 30,
      vc: 'it',         // Country
      vm: 'i',          // SafeSearch Filter Moderate
      // fl: 1,            //
      // vl: 'lang_it'  // Lingua risultati di ricerca
      // more info: https://search.yahoo.com//web/advanced
    }
  }
}
