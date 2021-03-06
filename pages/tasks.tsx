import React, { FC } from 'react';

import { useGetTasks } from '@squonk/data-manager-client/task';

import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { css } from '@emotion/react';
import { Container, Grid, IconButton, Tooltip, useTheme } from '@material-ui/core';
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';
import dayjs from 'dayjs';

import Layout from '../components/Layout';
import { Task } from '../components/Task';

const Tasks: FC = () => {
  const theme = useTheme();
  const { data, refetch } = useGetTasks();
  const tasks = data?.tasks;

  return (
    <Layout>
      <Container
        css={css`
          margin-top: ${theme.spacing(4)}px;
        `}
        maxWidth="md"
      >
        <div
          css={css`
            display: flex;
            align-items: center;
          `}
        >
          <h1>Tasks</h1>
          <Tooltip title="Refresh Tasks">
            <IconButton
              css={css`
                margin-left: auto;
              `}
              onClick={() => refetch()}
            >
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
        </div>
        <Grid container spacing={2}>
          {tasks
            ?.sort((taskA: any, taskB: any) =>
              dayjs(taskA.created).isBefore(dayjs(taskB.created)) ? 1 : -1,
            ) // Newest at the top
            ?.map((task) => (
              <Grid item key={task.id} xs={12}>
                <Task taskId={task.id} />
              </Grid>
            ))}
        </Grid>
      </Container>
    </Layout>
  );
};

export default withPageAuthRequired(Tasks);
