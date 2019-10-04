import { header, keys } from './fields';

export function fieldRenderer(key, config) {
  if (fields[key]) {
    config['renderer'] = addRenderer
  }

  return config;
}

function addRenderer(instance, td, row, col, prop, value, cellProperties) {
  while (td.firstChild) {
    td.removeChild(td.firstChild);
  }
  // prop === field name, renderers in a list or renderers
  var renderers = fields[prop];
  renderers.forEach(function(rndr) {
      rndr(instance, td, row, col, prop, value, cellProperties)
  });
}

var fields = {
  [keys.INDERES_INSTRUCTION]: [recommendationRenderer, renderColorColumn],
  [keys.YIELD]: [percentRenderer, renderColorColumn],
  [keys.DIVIDEND_YIELD]: [percentRenderer],
  [keys.POTENTIAL]: [percentRenderer, renderColorColumn],
  [keys.EXPECTED_GROWTH_FROM_START]: [percentRenderer, renderColorColumn],
  [keys.PERCENTAGE_OF_PORTFOLIO]: [percentRenderer],
  [keys.MARKET_PRICE_EUR]: [euroRenderer],
  [keys.YIELD_EUR]: [euroRenderer, renderColorColumn],
  [keys.EXPECTED_GROWTH_EUR]: [euroRenderer, renderColorColumn],
  [keys.EXPECTED_MARKET_PRICE_EUR]: [euroRenderer, renderColorColumn],
  [keys.EXPECTED_WIN_EUR]: [euroRenderer, renderColorColumn],
  [keys.MIDDLE_RATE]: [euroRenderer],
  [keys.PURCHASE_PRICE]: [euroRenderer, renderColorColumn],
  [keys.PRICE]: [euroRenderer],
  [keys.INDERES_TARGET_PRICE]: [euroRenderer, renderColorColumn],
  [keys.PURCHASE_PRICE_EUR]: [euroRenderer],
  [keys.AMOUNT_OF_STOCK]: [renderColorColumn],
  [keys.RESULT_EQUITY]: [renderColorColumn],
  [keys.PRICE_TO_EARNINGS]: [renderColorColumn],
  [keys.PRICE_TO_BOOK]: [renderColorColumn],
  [keys.PRICE_TO_SALES]: [renderColorColumn],
};

var fieldColors = {
  winLose: [
    keys.YIELD,
    keys.POTENTIAL,
    keys.YIELD_EUR,
    keys.EXPECTED_GROWTH_EUR,
    keys.EXPECTED_WIN_EUR,
    keys.EXPECTED_GROWTH_FROM_START,
  ],
  expectedGrowthColumns: [
    keys.EXPECTED_GROWTH_EUR,
    keys.EXPECTED_MARKET_PRICE_EUR,
    keys.EXPECTED_WIN_EUR,
    keys.EXPECTED_GROWTH_FROM_START,
  ],
  manualInputColumns: [
    keys.INDERES_INSTRUCTION,
    keys.INDERES_TARGET_PRICE,
    keys.AMOUNT_OF_STOCK,
    keys.PURCHASE_PRICE,
  ],
  keyFigures: [
    keys.RESULT_EQUITY,
    keys.PRICE_TO_EARNINGS,
    keys.PRICE_TO_BOOK,
    keys.PRICE_TO_SALES,
  ],
};

function recommendationRenderer(instance, td, row, col, prop, value, cellProperties) {

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
  // prop == key name
  var cur = 'EUR';
  if ([keys.PRICE, keys.INDERES_TARGET_PRICE].includes(prop)) {
    var localMarketArrayIndex = Object.keys(header).findIndex(element => element === keys.PRICE_TO_MARKET_LOCAL);
    cur = cellProperties.instance.getData()[row][localMarketArrayIndex].split(' ')[1]
  }
  formatTd(td, prop, value, cur);
};

function renderColorColumn(instance, td, row, col, prop, value, cellProperties) {
  if (! isNaN(value)) {

    if (fieldColors.winLose.includes(prop)) {
      if (value >= 0) {
        td.classList.add('text-success');
      } else {
        td.classList.add('text-danger');
      }
    }
  }

  if (fieldColors.expectedGrowthColumns.includes(prop)) {
    td.classList.add('expectedGrowth');
  }

  if (fieldColors.manualInputColumns.includes(prop)) {
    td.classList.add('manualInput');
  }

  if (fieldColors.keyFigures.includes(prop)) {
    td.classList.add('keyFigures');
  }

  // special cases
  if (prop === keys.AMOUNT_OF_STOCK) {
    value = Math.floor(value)
  }

  if (! td.textContent) {
    var el = document.createTextNode(value)
    td.appendChild(el)
  }
}

function formatTd(td, prop, value, suffix) {
  if (! isNaN(value)) {
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
