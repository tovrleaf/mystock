var config = require('../conf/api-secrets.json');
export async function getStockData() {
  var header = {
    'symbol': 'Nimi',
    'inderesInstuction': 'Suositus',
    'a': 'Tuotto %',
    'dividendYield': 'Osinkotuotto',
    'c': 'Potentiaali %',
    'd': 'Markkina-arvo EUR',
    'e': 'Tuotto EUR',
    'f': 'Kasvu  EUR (odotus)',
    'g': 'Markkina-arvo EUR (odotus)',
    'h': 'Voitto EUR (odotus)',
    'i': 'Kasvu % alusta (odotus)',
    'amountOfStocks': 'Määrä',
    'k': 'Keskikurssi',
    'purchasePrice': 'Hankintahinta',
    'price': 'Kurssi',
    'inderesTargetPrice': 'Inderes tavoitehinta',
    'o': 'Tulos/Oma Pääoma',
    'priceToEarnings': 'P/E',
    'priceToSales': 'P/S',
    'priceToBook': 'P/B',
    's': 'Markkina-arvo paikallinen',
    't': 'Hankintahinta EUR',
    'u': 'Osuus osakesalkusta'
  };

  const columns = Object.keys(header).map((k) => {
    return { key: k, name: header[k] };
  });

  var url = config.mystock_apiendpoint + '/api/shares';
  async function getData() {
    var response = await fetch(url, {
      headers: new Headers({
        'x-api-key': config.mystock_apikey
      }) 
    });
    return response.json();
  }

  const rows = await getData();
  var retRows = [];
  for (var k in rows) {
    retRows.push(rows[k]);
  }
  return {
    'cols': columns,
    'rows': retRows
  }
}
