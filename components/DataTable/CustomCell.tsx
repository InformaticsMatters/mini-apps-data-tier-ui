import React from 'react';

import { useQueryClient } from 'react-query';

import { Table } from '@devexpress/dx-react-grid-material-ui';
import styled from '@emotion/styled';
import { Button } from '@material-ui/core';
import {
  getGetAvailableDatasetsQueryKey,
  getGetProjectQueryKey,
  useDeleteDataset,
  useDeleteFile,
} from '@squonk/data-manager-client';

import { AttachButton } from './AttachButton';
import { TableRow } from './types';

type CustomCellProps = Omit<Table.DataCellProps, 'row'> & {
  row: TableRow;
};

/**
 * Display custom cell content.
 * ? We should probably implement this with a `Plugin` rather than this hack
 */
export const CustomCell: React.FC<CustomCellProps> = ({ row, column, ...rest }) => {
  const queryClient = useQueryClient();
  const deleteMutation = useDeleteDataset();
  const detachMutation = useDeleteFile();

  const id = row.id;
  const projectId = row.actions.projectId;
  const immutable = row.immutable;

  switch (column.name) {
    case 'actions':
      return (
        <Cell column={column} row={row} {...rest}>
          {/* <Button>Download</Button> */}
          {id?.startsWith('dataset') && (
            <>
              <Button
                onClick={async () => {
                  await deleteMutation.mutateAsync({ datasetid: id });
                  queryClient.invalidateQueries(getGetAvailableDatasetsQueryKey());
                }}
              >
                Delete
              </Button>
              <AttachButton datasetId={id} fileName={row.fileName} />
            </>
          )}
          {id?.startsWith('file') && projectId !== undefined && (
            <Button
              onClick={async () => {
                await detachMutation.mutateAsync({ fileid: id });
                queryClient.invalidateQueries(getGetProjectQueryKey(projectId));
              }}
            >
              Detach
            </Button>
          )}
          {/* <Button>Edit</Button> */}
        </Cell>
      );
    case 'immutable':
      return (
        <Cell column={column} row={row} {...rest}>
          {immutable === undefined ? '-' : immutable ? 'Yes' : 'No'}
        </Cell>
      );
    default:
      return <Cell column={column} row={row} {...rest} />;
  }
};

const Cell = styled(Table.Cell)`
  padding-top: 0;
  padding-bottom: 0;
`;
