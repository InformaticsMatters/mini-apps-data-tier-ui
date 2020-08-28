import React, { useState } from 'react';

import {
  IntegratedFiltering,
  IntegratedSelection,
  IntegratedSorting,
  SearchState,
  SelectionState,
  SortingState,
} from '@devexpress/dx-react-grid';
import {
  Grid,
  SearchPanel,
  TableHeaderRow,
  TableSelection,
  Toolbar,
  VirtualTable,
} from '@devexpress/dx-react-grid-material-ui';

import { useDatasets } from '../hooks';

// Types

interface ColumnTypes {
  name: string;
  projects: string[];
  labels: string[];
}

type Column = { name: keyof ColumnTypes; title: string };

const columns: Column[] = [
  { name: 'name', title: 'File Name' },
  // { name: 'projects', title: 'Projects' },
  { name: 'labels', title: 'Labels' },
];

interface Row extends ColumnTypes {
  id: number;
}

interface IProps {}

// This currently produces a React.StrictMode warning
// Which will be fixed in the next major version of dx-grid
// https://github.com/DevExpress/devextreme-reactive/issues/2727

const DataTable: React.FC<IProps> = () => {
  const [selection, setSelection] = useState<React.ReactText[]>([]);

  const { datasets, loading } = useDatasets();

  return (
    <>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Grid rows={datasets} columns={columns}>
          <SearchState defaultValue="" />
          <SelectionState selection={selection} onSelectionChange={setSelection} />
          <SortingState />
          <IntegratedFiltering />
          <IntegratedSelection />
          <IntegratedSorting />
          <VirtualTable />
          <TableHeaderRow showSortingControls />
          <TableSelection showSelectAll />
          <Toolbar />
          <SearchPanel />
        </Grid>
      )}
    </>
  );
};

export default DataTable;