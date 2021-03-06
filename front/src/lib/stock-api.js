import { header, keys } from './fields';
var config = require('../conf/api-secrets.json');

export async function getStockData() {

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
  var head = columns.map((r) => { return r['name']; })
  var topHeadersConfig = [
    ['', 1],
    ['Inderes', 2],
    ['', 5],
    ['Odotus', 4],
    ['Hankinta', 3],
    ['', 1],
    ['Tunnusluvut', 4],
  ]
  var topHeader = [];
  var l = 0;
  topHeadersConfig.forEach((i) => {
    topHeader.push({ label: '<b>' + i[0] + '</b>', colspan: i[1] });
    l += i[1];
  });
  topHeader.push({ label: '', colspan: head.length - l})

  head = [
    topHeader,
    head,
  ];

  var ret = retRows.map((r) => {
    var t = {};
    columns.forEach((item) => {
      t[item['key']] = r[item['key']];
    })
    return t;
  })

  // sort by symbol
  function cmp(a, b) {
    var s1 = a['symbol'];
    var s2 = b['symbol'];
    if (s1 > s2) {
      return 1;
    }
    if (s1 < s2) {
      return -1;
    }
    return 0;
  }
  ret.sort(cmp);

  return {
    'headers': head,
    'data': ret
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
  row[keys.INDERES_INSTRUCTION] = re[row[keys.INDERES_INSTRUCTION]] || '-';

  var cur = 'EUR';
  if (row['currency']) {
    cur = row['currency'];
  }

  row[keys.POTENTIAL] = (row[keys.INDERES_TARGET_PRICE] / row[keys.PRICE] - 1) * 100;
  if (isNaN(row[keys.POTENTIAL])) {
    row[keys.POTENTIAL] = '-';
  }

  row[keys.PRICE_TO_MARKET_LOCAL] = row[keys.AMOUNT_OF_STOCK] * row[keys.PRICE];
  row[keys.MARKET_PRICE_EUR] = row[keys.PRICE_TO_MARKET_LOCAL] / currencies[cur]['rate'];

  row[keys.EXPECTED_GROWTH_EUR] = row[keys.MARKET_PRICE_EUR] * row[keys.POTENTIAL] / 100;
  if (isNaN(row[keys.EXPECTED_GROWTH_EUR])) {
    row[keys.EXPECTED_GROWTH_EUR] = '-';
  }

  row[keys.EXPECTED_MARKET_PRICE_EUR] = row[keys.MARKET_PRICE_EUR] + row[keys.EXPECTED_GROWTH_EUR];
  if (isNaN(row[keys.EXPECTED_MARKET_PRICE_EUR])) {
    row[keys.EXPECTED_MARKET_PRICE_EUR] = '-';
  }

  row[keys.EXPECTED_WIN_EUR] = row[keys.EXPECTED_MARKET_PRICE_EUR] - row[keys.PURCHASE_PRICE];
  if (isNaN(row[keys.EXPECTED_WIN_EUR])) {
    row[keys.EXPECTED_WIN_EUR] = '-';
  }


  row[keys.EXPECTED_GROWTH_FROM_START] = (row[keys.EXPECTED_MARKET_PRICE_EUR] - row[keys.PURCHASE_PRICE]) / 10;
  if (isNaN(row[keys.EXPECTED_GROWTH_FROM_START])) {
    row[keys.EXPECTED_GROWTH_FROM_START] = '-';
  }

  row[keys.MIDDLE_RATE] = row[keys.PURCHASE_PRICE] / row[keys.AMOUNT_OF_STOCK];

  row[keys.YIELD_EUR] = row[keys.MARKET_PRICE_EUR] - row[keys.PURCHASE_PRICE];
  row[keys.YIELD] = (row[keys.MARKET_PRICE_EUR] / row[keys.PURCHASE_PRICE] - 1) * 100;
  row[keys.PURCHASE_PRICE_EUR] = row[keys.PRICE_TO_MARKET_LOCAL] / currencies[cur]['rate'];

  for (var k in row) {
    if (! isNaN(row[k])) {
      row[k] = Number(row[k]).toFixed(2);
    }
  }

  var localMarketValue = (Math.round(10 * row[keys.PRICE_TO_MARKET_LOCAL]) / 10);
  if (('' + localMarketValue).split('.').length === 1) {
    localMarketValue += '.0'
  }
  row[keys.PRICE_TO_MARKET_LOCAL] = localMarketValue + ' ' + cur;

  // @TODO calculate
  row[keys.RESULT_EQUITY] = '';

  return row;
}

function addPercentageOfEachShareInPortfolio(shares) {
  var totalSums = []
  for (var j in shares) {
    totalSums.push(shares[j][keys.MARKET_PRICE_EUR]);
  }

  var total = totalSums.reduce(function(accumulator, currentValue) {
    return Number(accumulator) + Number(currentValue);
  });

  // add total percentage of portfolio
  for (var l in shares) {
    shares[l][keys.PERCENTAGE_OF_PORTFOLIO] = Number(shares[l][keys.MARKET_PRICE_EUR] / total * 100).toFixed(2);
  }

  return shares;
}
