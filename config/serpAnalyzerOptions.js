module.exports = {
  default: {
    timeout: 10000,
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
      'accept-language': 'it,it-IT;'
    }
  },
  google: {
    baseURL: 'https://www.google.it',
    params: {
      num: 30,
      hl: 'it',         // lingua interfaccia utente
      cr: 'countryIT',  // risultati originari di un determinato paese
      gl: 'it',         // geolocalizzazione utente finale
      filter: 0,        // filtro risultati duplicati (0 mostra i risultati)
      // lr: 'lang_it', // risultati scritti in una particolare lingua (non molto efficace)
      // more info: https://developers.google.com/custom-search/v1/cse/list
    }
  },
  bing: {
    baseURL: 'https://www.bing.com',
    params: {
      count: 30,
      cc: 'it',
      setmkt: 'it-it',
      setlang: 'it-it'
      // more info: https://docs.microsoft.com/en-us/rest/api/cognitiveservices/bing-web-api-v7-reference#query-parameters
    }
  },
  yahoo: {
    baseURL: 'https://it.search.yahoo.com/',
    params: {
      n: 30,
      vc: 'it',
      vm: 'i',
      fl: 1,
      vl: 'lang_it'
      // more info: https://search.yahoo.com//web/advanced
    }
  }
}
