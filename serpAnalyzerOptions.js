module.exports = {
  default: {
    timeout: 10000,
    headers: {
      "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
    }
  },
  google: {
    baseURL: 'https://www.google.it',
    params: {
      num: 30
      // Ulteriori parametri
      // hl: 'it',         // lingua interfaccia utente
      // cr: 'countryIT',  // risultati originari di un determinato paese
      // lr: 'lang_it',    // risultati scritti in una particolare lingua (non molto efficace)
      // gl: 'it',         // geolocalizzazione utente finale
      // filter: 0         // filtro risultati duplicati (0 mostra i risultati)
    }
  },
  bing: {
    baseURL: 'https://www.bing.com',
    params: {
      count: 30
    }
  },
  yahoo: {
    baseURL: 'https://it.search.yahoo.com',
    // baseURL: 'https://search.yahoo.com',
    params: {
      n: 30, // MAX 40, intervalli di 10
      // ei: 'UTF-8',
      // p: ''
      // fr: 'yfp-t',
      // fp: 1,
      // toggle: 1,
      // cop: 'mss',
      // ei: 'UTF-8'
    }
  }
}
