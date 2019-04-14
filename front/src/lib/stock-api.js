var config = require('../conf/api-secrets.json');
export async function getStockData() {
  var header = {
    'symbol': 'Nimi',
    'inderesInstruction': 'Suositus',
    'yield': 'Tuotto %',
    'dividendYield': 'Osinkotuotto',
    'potential': 'Potentiaali %',
    'marketPriceEur': 'Markkina-arvo EUR',
    'yieldEur': 'Tuotto EUR',
    'expectedGrowthEur': 'Kasvu  EUR (odotus)',
    'expectedMarketPriceEur': 'Markkina-arvo EUR (odotus)',
    'expectedWinEur': 'Voitto EUR (odotus)',
    'expectedGrowthFromStart': 'Kasvu % alusta (odotus)',
    'amountOfStocks': 'Määrä',
    'middleRate': 'Keskikurssi',
    'purchasePrice': 'Hankintahinta',
    'price': 'Kurssi',
    'inderesTargetPrice': 'Inderes tavoitehinta',
    'o': 'Tulos/Oma Pääoma',
    'priceToEarnings': 'P/E',
    'priceToSales': 'P/S',
    'priceToBook': 'P/B',
    'marketPriceLocal': 'Markkina-arvo paikallinen',
    'purchasePriceEur': 'Hankintahinta EUR',
    'percentageOfPortfolio': 'Osuus osakesalkusta'
  };

  const columns = Object.keys(header).map((k) => {
    return { key: k, name: header[k] };
  });

  var rows;
  if ('#local' === window.location.hash) {
    rows = await fetchFromLocalFixture();
  } else {
    rows = await fetchFromApi();
  }
  var retRows = [];
  var shares = rows['shares'];
  for (var k in shares) {
    retRows.push(addFrontendFields(shares[k], rows['currencies']));
  }

  shares = addPercentageOfEachShareInPortfolio(shares);

  return {
    'cols': columns,
    'rows': retRows
  }
}

async function fetchFromApi() {
  var url = config.mystock_apiendpoint + '/api/shares';
  var response = await fetch(url, {
    headers: new Headers({
      'x-api-key': config.mystock_apikey
    }) 
  });
  return response.json();
}

async function fetchFromLocalFixture() {
  if ('localhost' !== window.location.hostname) {
    return [];
  }
  return require('../data/fixture.json');
}

function addFrontendFields(row, currencies) {
  var re = {'m': 'Myy', 'o': 'Osta', 'v': 'Vähennä', 'l': 'Lisää'};
  row['inderesInstruction'] = re[row['inderesInstruction']] || '-';

  row['marketPriceLocal'] = row['amountOfStocks'] * row['price'];
  var cur = 'EUR';
  if (row['currency']) {
    cur = row['currency'];
  }
  row['marketPriceEur'] = row['marketPriceLocal'] / currencies[cur]['rate'];

  row['yieldEur'] = (row['marketPriceLocal'] - row['purchasePrice']) / currencies[cur]['rate'];

  row['potential'] = (row['inderesTargetPrice'] / row['price'] - 1) * 100;
  if (isNaN(row['potential'])) {
    row['potential'] = '-';
  }

  row['expectedGrowthEur'] = row['marketPriceEur'] * row['potential'] / 100;
  if (isNaN(row['expectedGrowthEur'])) {
    row['expectedGrowthEur'] = '-';
  }

  row['expectedMarketPriceEur'] = row['marketPriceEur'] + row['expectedGrowthEur'];
  if (isNaN(row['expectedMarketPriceEur'])) {
    row['expectedMarketPriceEur'] = '-';
  }

  row['expectedWinEur'] = row['expectedMarketPriceEur'] - (row['purchasePrice'] / currencies[cur]['rate']);
  if (isNaN(row['expectedWinEur'])) {
    row['expectedWinEur'] = '-';
  }

  row['yield'] = (row['marketPriceLocal'] / row['purchasePrice'] - 1) * 100;

  row['expectedGrowthFromStart'] = (row['expectedMarketPriceEur'] - row['purchasePrice']) / 10;
  if (isNaN(row['expectedGrowthFromStart'])) {
    row['expectedGrowthFromStart'] = '-';
  }

  row['middleRate'] = row['purchasePrice'] / row['amountOfStocks'];
  row['purchasePriceEur'] = row['marketPriceLocal'] / currencies[cur]['rate'];

  for (var k in row) {
    if (! isNaN(row[k])) {
      row[k] = Number(row[k]).toFixed(2);
    }
  }

  return row;
}

function addPercentageOfEachShareInPortfolio(shares) {
  var totalSums = []
  for (var j in shares) {
    totalSums.push(shares[j]['marketPriceEur']);
  }

  var total = totalSums.reduce(function(accumulator, currentValue) {
    return Number(accumulator) + Number(currentValue);
  });

  // add total percentage of portfolio
  for (var l in shares) {
    shares[l]['percentageOfPortfolio'] = Number(shares[l]['marketPriceEur'] / total * 100).toFixed(2);
  }

  return shares;
}
