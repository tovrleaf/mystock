import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import {getStockData} from './lib/stock-api';


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

    getStockData().then(data => {
      this.setState({
        columns: data['cols'],
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
