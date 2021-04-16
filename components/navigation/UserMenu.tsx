import { bindPopover, bindTrigger, usePopupState } from 'material-ui-popup-state/hooks';
import Link from 'next/link';

import { useUser } from '@auth0/nextjs-auth0';
import { css } from '@emotion/react';
import { IconButton, Popover, Typography } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';

export const UserMenu = () => {
  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'user-menu',
  });

  const { user, error, isLoading } = useUser();

  return (
    <div
      css={css`
        margin-left: auto;
      `}
    >
      <IconButton disabled={isLoading} edge="end" color="inherit" {...bindTrigger(popupState)}>
        <AccountCircle />
      </IconButton>

      <Popover
        css={css`
          padding: 8px;
        `}
        {...bindPopover(popupState)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Typography variant="h6">Account</Typography>
        {isLoading ? (
          <Typography>Loading...</Typography>
        ) : user ? (
          <Typography>
            {user.preferred_username} / <Link href="/api/auth/logout">Logout</Link>
          </Typography>
        ) : (
          <Typography>
            <Link href="/api/auth/login">Login</Link>
          </Typography>
        )}
      </Popover>
    </div>
  );
};