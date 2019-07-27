import './App.css'
import React from 'react';
import { HotTable } from '@handsontable/react';
import { getStockData } from './lib/stock-api';
const keys = require('./lib/fields');

class App extends React.Component {
  constructor(props) {
    super(props);

    var percentRenderer = function (instance, td, row, col, prop, value, cellProperties) {
      while (td.firstChild) {
        td.removeChild(td.firstChild);
      }
      if (! isNaN(value)) {
        value += '%'
        td.classList.add('htRight');
      }
      var el = document.createTextNode(value)
      td.appendChild(el)
    };

    var cols = [];
    for (var k in keys) {
      var o = {data: keys[k]}

      switch (keys[k]) {
        // this should be /100
        case keys.YIELD:
        case keys.DIVIDEND_YIELD:
        case keys.POTENTIAL:
        case keys.EXPECTED_GROWTH_FROM_START:
        case keys.PERCENTAGE_OF_PORTFOLIO:
          o['renderer'] = percentRenderer
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
