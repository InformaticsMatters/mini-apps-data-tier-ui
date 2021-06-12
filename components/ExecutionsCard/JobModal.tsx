import React, { FC, useState } from 'react';

import { Button, Grid, Tooltip, Typography } from '@material-ui/core';
import Form from '@rjsf/material-ui';
import { useGetJob } from '@squonk/data-manager-client';

import { useCurrentProjectId } from '../CurrentProjectContext';
import { useSelectedFiles } from '../DataTable/FileSelectionContext';
import { ModalWrapper } from '../ModalWrapper';
import { JobSpecification } from './JobCard';
import { JobInputFields } from './JobInputFields';

interface JobModalProps {
  jobId: number;
  handleRunJob: (specification: JobSpecification) => void;
}

export const JobModal: FC<JobModalProps> = ({ jobId, handleRunJob }) => {
  const [open, setOpen] = useState(false);

  const [projectId] = useCurrentProjectId();
  const { data: job } = useGetJob(jobId); // Get extra details about the job

  // Data to populate file/dir inputs
  const selectedFilesState = useSelectedFiles();

  // Control for generated options form
  const [optionsFormData, setOptionsFormData] = useState<any>(null);

  // Control for the inputs fields
  const [inputsData, setInputsData] = useState({});

  const handleSubmit = async () => {
    if (projectId && job) {
      // Construct the specification
      const specification: JobSpecification = {
        collection: job.collection,
        job: job.job,
        version: job.version,
        variables: { ...inputsData, ...optionsFormData },
      };

      handleRunJob(specification);

      setOpen(false);
    }
  };

  if (selectedFilesState) {
    return (
      <>
        <Tooltip
          arrow
          title={
            selectedFilesState.selectedFiles.length
              ? 'Run this job'
              : 'Please select some files on the data tab first'
          }
        >
          <span>
            <Button
              color="primary"
              disabled={!job || !selectedFilesState.selectedFiles.length}
              onClick={() => setOpen(true)}
            >
              Run
            </Button>
          </span>
        </Tooltip>
        <ModalWrapper
          title="Run Job"
          submitText="Run"
          open={open}
          onClose={() => setOpen(false)}
          onSubmit={handleSubmit}
        >
          {job && (
            <Grid container spacing={2}>
              {job.variables.inputs && (
                <>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle1" component="h3">
                      <b>Inputs</b>
                    </Typography>
                  </Grid>
                  <JobInputFields
                    setInputsData={setInputsData}
                    inputs={job.variables.inputs as any}
                  />
                </>
              )}

              <Grid item xs={12}>
                {job.variables.options && (
                  <>
                    <Typography gutterBottom variant="subtitle1" component="h3">
                      <b>Options</b>
                    </Typography>
                    <Form
                      showErrorList={false}
                      liveValidate
                      noHtml5Validate
                      schema={job.variables.options as any}
                      formData={optionsFormData}
                      onChange={(event) => setOptionsFormData(event.formData)}
                    >
                      {/* Remove the default submit button */}
                      <div />
                    </Form>
                  </>
                )}
              </Grid>
            </Grid>
          )}
        </ModalWrapper>
      </>
    );
  } else {
    return (
      <Tooltip title="Please select a project first">
        <span>
          <Button disabled color="primary">
            Run
          </Button>
        </span>
      </Tooltip>
    );
  }
};