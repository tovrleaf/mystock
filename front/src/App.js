import './App.css'
import React from 'react';
import { HotTable } from '@handsontable/react';
import { getStockData } from './lib/stock-api';
import { getColumns, getCells } from './lib/front-format';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      settings: {
        autoColumnSizeObject: true,
        colHeaders: true,
        columnSorting: true,
        columns: getColumns(),
        comments: true,
        contextMenu: true,
        dropdownMenu: true,
        filters: true,
        fixedColumnsLeft: 1,
        headers: true,
        hiddenColumns: true,
        licenseKey: 'non-commercial-and-evaluation',
        manualColumnFreeze: true,
        manualColumnMove: true,
        manualColumnResize: true,
        manualRowMove: true,
        rowHeaders: true,
      },
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
        collapsibleColumnsConfig.push({ row: -2, col: i, collapsible: true });
      });

      this.setState({
        settings: {
          cell: cells,
          collapsibleColumns: collapsibleColumnsConfig,
          data: data,
          nestedHeaders: nestedHeaders,
        }
      })
    })
  };

  render() {
    return (
      <div>
        <HotTable id="hot" settings={this.state.settings} />
      </div>
    )
  }
}

export default App;
