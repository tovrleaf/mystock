import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import ReactDataGrid from 'react-data-grid';
import { getStockData } from './lib/stock-api';
const keys = require('./lib/fields');
const {
  DraggableHeader: { DraggableContainer }
} = require("react-data-grid-addons");


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
        if (v['key'] === keys.SYMBOL) {
          v['frozen'] = true;
        } else {
          v['draggable'] = true;
        }

        if (v['key'] === keys.PERCENTAGE_OF_PORTFOLIO) {
          v['formatter'] = ProgressBarFormatter;
        }
        return v;
      });

      const defaultColumnProperties = {
        resizable: true,
        width: 70
      };

      cols = cols.map(c => ({ ...c, ...defaultColumnProperties }));

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

  onHeaderDrop = (source, target) => {
    const stateCopy = Object.assign({}, this.state);
    const columnSourceIndex = this.state.columns.findIndex(
      i => i.key === source
    );
    const columnTargetIndex = this.state.columns.findIndex(
      i => i.key === target
    );

    stateCopy.columns.splice(
      columnTargetIndex,
      0,
      stateCopy.columns.splice(columnSourceIndex, 1)[0]
    );

    const emptyColumns = Object.assign({}, this.state, { columns: [] });
    this.setState(emptyColumns);

    const reorderedColumns = Object.assign({}, this.state, {
      columns: stateCopy.columns
    });
    this.setState(reorderedColumns);
  };
  
  render() {
    return (
      <DraggableContainer onHeaderDrop={this.onHeaderDrop}>
        <ReactDataGrid
          columns={this.state.columns}
          rowGetter={i => this.state.rows[i]}
          rowsCount={this.state.rows.length}
          onGridRowsUpdated={this.onGridRowsUpdated}
          enableCellSelect={true}
        />
      </DraggableContainer>
    );
  }
}

export default App;
