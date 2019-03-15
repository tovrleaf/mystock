var config = require('../conf/api-secrets.json');
export async function getStockData() {
  var header = {
    'symbol': 'Nimi',
    'inderesInstuction': 'Suositus',
    'a': 'Tuotto %',
    'dividendYield': 'Osinkotuotto',
    'c': 'Potentiaali %',
    'd': '"Markkina-arvo EUR"',
    'e': 'Tuotto',
    'f': 'EUR	"Kasvu  EUR (odotus)"',
    'g': '"Markkina-arvo EUR (odotus)"',
    'h': '"Voitto EUR (odotus)"',
    'i': 'Kasvu % alusta (odotus)"',
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




  // const rows = [
  //   {
  //     "priceToBook": "4.892",
  //     "returnOnEquity": "24.172",
  //     "inderesInstuction": "o",
  //     "symbol": "VERK",
  //     "amountOfStocks": "12",
  //     "inderesTargetPrice": "42.1",
  //     "dividendYield": "4.853",
  //     "purchasePrice": "45",
  //     "priceToSales": "0.413518134728",
  //     "price": "4.125",
  //     "priceToEarnings": "19.672"
  //   },
  //   {
  //     "priceToBook": "3.581",
  //     "returnOnEquity": "18.29",
  //     "price": "14.2955",
  //     "dividendYield": "3.278",
  //     "priceToSales": "1.7869375",
  //     "symbol": "WRT1V",
  //     "priceToEarnings": "20.881"
  //   }
  // ];



}
