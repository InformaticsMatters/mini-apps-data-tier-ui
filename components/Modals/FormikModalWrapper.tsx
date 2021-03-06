import React from 'react';

import { css } from '@emotion/react';
import { DialogProps } from '@material-ui/core';
import { Form, Formik, FormikConfig } from 'formik';

import { ModalWrapper } from './ModalWrapper';
import { BaseModalWrapperProps } from './types';

interface FormikModalWrapperProps extends BaseModalWrapperProps {
  id: string;
  title: string;
  submitText: string;
  open: boolean;
  onClose: () => void;
  DialogProps?: Partial<DialogProps>;
}

/**
 * Reusable Modal/Dialog component with Formik integration for easy Modal forms
 * Unlike the {@link ModalWrapper} component, the submit button is always required
 *
 * @privateRemarks
 *
 * We use a function here instead of arrow functions as generics work better with them
 */
export function FormikModalWrapper<Values>({
  id,
  title,
  submitText,
  open,
  onClose,
  children,
  DialogProps,
  ...formikProps
}: FormikModalWrapperProps & FormikConfig<Values>) {
  return (
    <Formik {...formikProps}>
      {({ submitForm, isSubmitting, isValid, ...rest }) => (
        <Form
          css={css`
            display: inline;
          `}
        >
          <ModalWrapper
            DialogProps={DialogProps}
            id={id}
            open={open}
            submitDisabled={isSubmitting || !isValid}
            submitText={submitText}
            title={title}
            onClose={onClose}
            onSubmit={submitForm}
          >
            {typeof children === 'function'
              ? children({ isValid, submitForm, isSubmitting, ...rest })
              : children}
          </ModalWrapper>
        </Form>
      )}
    </Formik>
  );
}
