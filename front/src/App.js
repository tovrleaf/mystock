import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import ReactDataGrid from 'react-data-grid';
import {getStockData} from './lib/stock-api';
const keys = require('./lib/fields');


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      columns: [],
      rows: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });

    var ProgressBarFormatter = ({ value }) => {
      return <ProgressBar now={value} label={`${value}%`} />;
    };

    getStockData().then(data => {

      var cols = data['cols'].map((v) => {
        if (v['key'] === keys.PERCENTAGE_OF_PORTFOLIO) {
          v['formatter'] = ProgressBarFormatter;
        }
        return v;
      });

      this.setState({
        columns: cols,
        rows: data['rows'],
        isLoading: false
      })
    });
  };
  
  onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
    this.setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };
  
  render() {
    return (
      <ReactDataGrid
        columns={this.state.columns}
        rowGetter={i => this.state.rows[i]}
        rowsCount={this.state.rows.length}
        onGridRowsUpdated={this.onGridRowsUpdated}
        enableCellSelect={true}
      />
    );
  }
}

export default App;
