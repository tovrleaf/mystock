import './App.css'
import React from 'react';
import { HotTable } from '@handsontable/react';
import { getStockData } from './lib/stock-api';
const keys = require('./lib/fields');

class App extends React.Component {
  constructor(props) {
    super(props);

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

    function percentRenderer(instance, td, row, col, prop, value, cellProperties) {
      formatTd(td, prop, value, '%');
    };

    function euroRenderer(instance, td, row, col, prop, value, cellProperties) {
      formatTd(td, prop, value, 'EUR');
    };

    var cols = [];
    for (var k in keys) {
      var o = {data: keys[k]}

      switch (keys[k]) {
        case keys.INDERES_INSTRUCTION:
          o['renderer'] = recommendationRenderer
          break;

        case keys.YIELD:
        case keys.DIVIDEND_YIELD:
        case keys.POTENTIAL:
        case keys.EXPECTED_GROWTH_FROM_START:
        case keys.PERCENTAGE_OF_PORTFOLIO:
          o['renderer'] = percentRenderer
          break;

        case keys.MARKET_PRICE_EUR:
        case keys.YIELD_EUR:
        case keys.EXPECTED_GROWTH_EUR:
        case keys.EXPECTED_MARKET_PRICE_EUR:
        case keys.EXPECTED_WIN_EUR:
        case keys.MIDDLE_RATE:
        case keys.PURCHASE_PRICE:
        case keys.PRICE:
        case keys.INDERES_TARGET_PRICE:
        case keys.PURCHASE_PRICE_EUR:
          o['renderer'] = euroRenderer
          break;

        case keys.AMOUNT_OF_STOCK:
          o['type'] = 'numeric';
          o['numericFormat'] = {
            mantissa: '0'
          }
          break;

        default:
          break;
      }

      cols.push(o)
    }

    this.state = {
      headers: [],
      data: [],
      columns: cols,
    }
  };

  componentDidMount() {
    getStockData().then(body => {

      this.setState({
        headers: body['headers'],
        data: body['data']
      })
    })
  };

  render() {
    return (
      <div>
        <HotTable
          id="hot"
          data={this.state.data}
          colHeaders={this.state.headers}
          columns={this.state.columns}
          rowHeaders={true}
          dropdownMenu={true}
          filters={true}
          fixedColumnsLeft={1}
          manualColumnResize={true}
          manualColumnMove={true}
          manualRowMove={true}
          contextMenu={true}
          manualColumnFreeze={true}
          columnSorting={true}
          licenseKey='non-commercial-and-evaluation'
          />
      </div>
    );
  }
}

export default App;
