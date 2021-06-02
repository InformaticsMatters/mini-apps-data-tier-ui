import React from 'react';

import { css } from '@emotion/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';

import { SlideUpTransition } from '../SlideUpTransition';

interface ModalWrapperProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  open,
  onClose,
  onSubmit,
}) => {
  return (
    <Dialog
      aria-labelledby="file-upload-title"
      css={css`
        .MuiDialog-paper {
          width: min(90vw, 700px);
        }
      `}
      open={open}
      TransitionComponent={SlideUpTransition}
      onClose={onClose}
    >
      <DialogTitle id="file-upload-title">Upload new datasets</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        <Button color="default" onClick={onClose}>
          Close
        </Button>
        <Button onClick={onSubmit}>Upload</Button>
      </DialogActions>
    </Dialog>
  );
};
