import React, { FC, useState } from 'react';

import { AxiosError } from 'axios';
import { Field } from 'formik';
import { CheckboxWithLabel, TextField } from 'formik-material-ui';
import { useQueryClient } from 'react-query';
import * as yup from 'yup';

import { useUser } from '@auth0/nextjs-auth0';
import {
  FormControl,
  FormGroup,
  IconButton,
  MenuItem,
  Tooltip,
  Typography,
} from '@material-ui/core';
import AttachFileRoundedIcon from '@material-ui/icons/AttachFileRounded';
import { DatasetVersionDetail } from '@squonk/data-manager-client';
import { useAttachFile } from '@squonk/data-manager-client/file';
import { getGetProjectQueryKey, useGetProjects } from '@squonk/data-manager-client/project';
import { useGetFileTypes } from '@squonk/data-manager-client/type';

import { FormikModalWrapper } from '../Modals/FormikModalWrapper';

interface AttachButtonProps {
  datasetId: string;
  versions: DatasetVersionDetail[];
  fileName: string;
}

interface FormState {
  project: string;
  type: string;
  path: string;
  version: DatasetVersionDetail['version'];
  isImmutable: boolean;
  isCompress: boolean;
}

export const AttachButton: FC<AttachButtonProps> = ({ datasetId, fileName, versions }) => {
  const [open, setOpen] = useState(false);
  const { user, isLoading: isUserLoading } = useUser();

  const queryClient = useQueryClient();
  const { mutate: attachFile, error } = useAttachFile();
  const errorMessage = (error as null | AxiosError)?.response?.data.detail;

  const { data: projectsData, isLoading: isProjectsLoading } = useGetProjects();
  const projects = projectsData?.projects.filter(({ editors }) =>
    editors.includes(user?.preferred_username as string),
  );

  const { data: typesData, isLoading: isTypesLoading } = useGetFileTypes();
  const types = typesData?.types;

  const initialValues: FormState = {
    project: projects?.[0]?.project_id ?? '',
    type: types?.[0].mime ?? '',
    path: '',
    version: versions[0].version,
    isImmutable: true,
    isCompress: false,
  };

  return (
    <>
      <Tooltip title="Attach dataset to a project">
        <span>
          <IconButton
            size="small"
            disabled={isProjectsLoading || isTypesLoading || isUserLoading}
            onClick={() => setOpen(true)}
          >
            <AttachFileRoundedIcon />
          </IconButton>
        </span>
      </Tooltip>
      <FormikModalWrapper
        enableReinitialize
        initialValues={initialValues}
        onClose={() => setOpen(false)}
        open={open}
        title={`Attach ${fileName} to project`}
        id={`attach-dataset-${datasetId}`}
        submitText="Attach"
        onSubmit={(
          { project, type, version, path, isImmutable, isCompress },
          { setSubmitting },
        ) => {
          attachFile(
            {
              data: {
                dataset_version: version,
                dataset_id: datasetId,
                project_id: project,
                immutable: isImmutable,
                compress: isCompress,
                as_type: type,
                path,
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries(getGetProjectQueryKey(project));
                setOpen(false);
                setSubmitting(false);
              },
              onError: () => setSubmitting(false),
            },
          );
        }}
        DialogProps={{ maxWidth: 'sm', fullWidth: true }}
        validationSchema={yup.object({
          path: yup.string().matches(/^\/([A-z0-9-_+]+\/)*([A-z0-9]+)$/gm, 'Invalid Path'),
        })}
      >
        <FormControl fullWidth margin="dense">
          <Field id="select-project" component={TextField} name="project" select label="Project">
            {(projects ?? []).map((project) => (
              <MenuItem key={project.project_id} value={project.project_id}>
                {project.name}
              </MenuItem>
            ))}
          </Field>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <Field name="version" component={TextField} select label="Version" id="select-version">
            {versions.map((version) => (
              <MenuItem key={version.version} value={version.version}>
                {`v${version.version}`}
              </MenuItem>
            ))}
          </Field>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <Field
            name="type"
            component={TextField}
            select
            id="select-type"
            label="File Type"
            helperText="The desired Dataset file type (a MIME type). Whether or not the chosen fileType is supported will depend on the Dataset."
          >
            {(types ?? []).map((type) => (
              <MenuItem key={type.mime} value={type.mime}>
                {type.mime}
              </MenuItem>
            ))}
          </Field>
        </FormControl>
        <FormGroup row>
          <Field
            component={CheckboxWithLabel}
            name="isImmutable"
            type="checkbox"
            Label={{ label: 'Immutable' }}
          />
          <Field
            component={CheckboxWithLabel}
            name="isCompress"
            type="checkbox"
            Label={{ label: 'Compress' }}
          />
        </FormGroup>
        <FormControl fullWidth margin="normal">
          <Field
            component={TextField}
            label="Path"
            name="path"
            helperText="A path within the Project to add the File, default is the project root ('/'), the mount-point within the application container. For example a valid path is '/path/subpath'."
          />
        </FormControl>
        {errorMessage && (
          <Typography variant="body1" color="error">
            Error: {errorMessage}
          </Typography>
        )}
      </FormikModalWrapper>
    </>
  );
};
