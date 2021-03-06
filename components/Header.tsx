import React, { FC } from 'react';

import { useUser } from '@auth0/nextjs-auth0';
import { css } from '@emotion/react';
import { AppBar, Toolbar, useTheme } from '@material-ui/core';
import { useRouter } from 'next/router';

import { Logo } from './navigation/Logo';
import { NavLink } from './navigation/NavLink';
import { UserMenu } from './navigation/UserMenu';
import { ProjectManager } from './ProjectManager/ProjectManager';

const Header: FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const { user } = useUser();

  return (
    <AppBar position="static">
      <Toolbar>
        <Logo />

        <nav
          css={css`
            display: flex;
            align-items: center;

            & div {
              display: inline-block;
              width: 120px;
              text-align: center;
            }

            & div:first-of-type {
              margin-left: ${theme.spacing(8)}px;
            }
          `}
        >
          <div>
            <NavLink
              stripQueryParameters={router.pathname === '/data' ? ['project'] : undefined}
              title="Data"
            />
          </div>
          <div>
            <NavLink title="Executions" />
          </div>
          <div>
            <NavLink title="Tasks" />
          </div>
        </nav>
        <div
          css={css`
            display: flex;
            margin-left: auto;
          `}
        >
          {user && <ProjectManager inverted />}
          <UserMenu />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
