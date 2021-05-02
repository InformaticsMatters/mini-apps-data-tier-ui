import React, { useCallback } from 'react';

import { FileRejection, useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from 'uuid';

import { css } from '@emotion/react';
import { Divider, useTheme } from '@material-ui/core';

import { UploadableFile } from './FileUpload';
import { allowedFileTypes } from './utils';

interface DropzoneProps {
  files: UploadableFile[];
  setFiles: (newFiles: UploadableFile[]) => void;
}

export const Dropzone: React.FC<DropzoneProps> = ({ children, files, setFiles }) => {
  const theme = useTheme();

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
    const mappedAccepted = acceptedFiles.map((file) => ({
      file,
      errors: [],
      id: uuidv4(),
      progress: 0,
      taskId: null,
    }));
    const mappedRejected = rejectedFiles.map((rejection) => ({
      ...rejection,
      id: uuidv4(),
      progress: 0,
      taskId: null,
    }));
    setFiles([...files, ...mappedAccepted, ...mappedRejected]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: allowedFileTypes,
    maxSize: 25 * 1024 ** 2, // 25 MB - same as the API route limit
  });

  return (
    <div
      {...getRootProps()}
      css={css`
        border: 2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.grey[600]};
        border-radius: 8px;
        padding-left: ${theme.spacing(1)}px;
        padding-right: ${theme.spacing(1)}px;
        max-height: 80vh;
        overflow-y: scroll;
      `}
    >
      <input {...getInputProps()} />
      <button
        css={css`
          cursor: pointer;
          text-align: center;
          border: none;
          background: none;
          display: block;
          width: 100%;
          margin-top: ${theme.spacing(2)}px;
          margin-bottom: ${theme.spacing(2)}px;
          font-size: 1rem;
        `}
      >
        Drag and drop files here, or click to select files
      </button>
      {!!files.length && (
        <Divider
          css={css`
            margin-top: ${theme.spacing(2)}px;
            margin-bottom: ${theme.spacing(2)}px;
          `}
        />
      )}
      {children}
    </div>
  );
};