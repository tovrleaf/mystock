import './App.css'
import React from 'react';
import { HotTable } from '@handsontable/react';
import { getStockData } from './lib/stock-api';
import { getColumns, getCells } from './lib/front-format';
const keys = require('./lib/fields');

class App extends React.Component {
  constructor(props) {
    super(props);

    var cols = getColumns();

    this.state = {
      headers: [],
      data: [],
      columns: cols,
      cell: []
    }
  };

  componentDidMount() {
    getStockData().then(body => {

      var data = body['data'];
      var cells = getCells(Object.keys(data[0]));

      this.setState({
        headers: body['headers'],
        data: data,
        cell: cells
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
          cell={this.state.cell}
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
          comments={true}
          licenseKey='non-commercial-and-evaluation'
          />
      </div>
    );
  }
}

export default App;
