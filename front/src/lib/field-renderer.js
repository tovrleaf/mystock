const keys = require('./fields');

export function fieldRenderer(key, config) {
  if (fields[key]) {
    config['renderer'] = addRenderer
  }

  if (key === keys.AMOUNT_OF_STOCK) {
    config['type'] = 'numeric';
    config['numericFormat'] = {
      mantissa: '0'
    }
  }

  return config;
}

function addRenderer(instance, td, row, col, prop, value, cellProperties) {
  var renderers = fields[prop];
  renderers.forEach(function(rndr) {
      rndr(instance, td, row, col, prop, value, cellProperties)
  });
}

var fields = {
  [keys.INDERES_INSTRUCTION]: [recommendationRenderer],
  [keys.YIELD]: [percentRenderer],
  [keys.DIVIDEND_YIELD]: [percentRenderer],
  [keys.POTENTIAL]: [percentRenderer],
  [keys.EXPECTED_GROWTH_FROM_START]: [percentRenderer],
  [keys.PERCENTAGE_OF_PORTFOLIO]: [percentRenderer],
  [keys.MARKET_PRICE_EUR]: [euroRenderer],
  [keys.YIELD_EUR]: [euroRenderer],
  [keys.EXPECTED_GROWTH_EUR]: [euroRenderer],
  [keys.EXPECTED_MARKET_PRICE_EUR]: [euroRenderer],
  [keys.EXPECTED_WIN_EUR]: [euroRenderer],
  [keys.MIDDLE_RATE]: [euroRenderer],
  [keys.PURCHASE_PRICE]: [euroRenderer],
  [keys.PRICE]: [euroRenderer],
  [keys.INDERES_TARGET_PRICE]: [euroRenderer],
  [keys.PURCHASE_PRICE_EUR]: [euroRenderer],
};

function recommendationRenderer(instance, td, row, col, prop, value, cellProperties) {
  while (td.firstChild) {
    td.removeChild(td.firstChild);
  }

  var el = document.createElement('span');
  el.classList.add('badge');
  el.textContent = value;
  td.classList.add('htCenter')

  var cls = '';
  switch (value) {
    case 'Osta':
      cls = 'success';
      break;
    case 'Lisää':
      cls = 'info';
      break;
    case 'Vähennä':
      cls = 'warning';
      break;
    case 'Myy':
      cls = 'danger';
      break;
    default:
      cls = 'light'
      break;
  }
  el.classList.add('badge-' + cls);

  td.appendChild(el)
}

function percentRenderer(instance, td, row, col, prop, value, cellProperties) {
  formatTd(td, prop, value, '%');
};

function euroRenderer(instance, td, row, col, prop, value, cellProperties) {
  formatTd(td, prop, value, 'EUR');
};

var addColorsToColumns = [
  keys.YIELD,
  keys.DIVIDEND_YIELD,
  keys.POTENTIAL,
  keys.YIELD_EUR,
  keys.EXPECTED_GROWTH_EUR,
  keys.EXPECTED_WIN_EUR,
  keys.EXPECTED_GROWTH_FROM_START,
];

function formatTd(td, prop, value, suffix) {
  while (td.firstChild) {
    td.removeChild(td.firstChild);
  }
  if (! isNaN(value)) {

    if (addColorsToColumns.includes(prop)) {
      if (value >= 0) {
        td.classList.add('text-success');
      } else {
        td.classList.add('text-danger');
      }
    }

    value = Math.round(value * 10) / 10;
    if (('' + value).split('.').length === 1) {
      value += '.0'
    }
    value += ' ' + suffix;
    td.classList.add('htRight');
  }
  var el = document.createTextNode(value)
  td.appendChild(el)
};
