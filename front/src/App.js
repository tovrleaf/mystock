import './App.css'
import React from 'react';
import { HotTable } from '@handsontable/react';
import { getStockData } from './lib/stock-api';
import { getColumns, getCells } from './lib/front-format';

class App extends React.Component {
  constructor(props) {
    super(props);

    var cols = getColumns();

    this.state = {
      headers: true,
      data: [],
      columns: cols,
      cell: []
    }
  };

  componentDidMount() {
    getStockData().then(body => {

      var data = body['data'];
      var cells = getCells(Object.keys(data[0]));
      var nestedHeaders = body['headers'];

      var collapsibleColumnsConfig = [];
      var i = 0;
      nestedHeaders[0].forEach((item) => {
        i += item['colspan'];
        collapsibleColumnsConfig.push({ row: -2, col: i, collapsible: true});
      });

      this.setState({
        headers: true,
        data: data,
        cell: cells,
        nestedHeaders: nestedHeaders,
        collapsibleColumns: collapsibleColumnsConfig,
      })
    });

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
          nestedHeaders={this.state.nestedHeaders}
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
          autoColumnSizeObject={true}
          collapsibleColumns={this.state.collapsibleColumns}
          hiddenColumns={true}
          licenseKey='non-commercial-and-evaluation'
          />
      </div>
    );
  }
}

export default App;
