import React, { useState } from "react";
import { FormProvider, useForm } from "./FormContext";
import LoadingButton from "./LoadingButton";

interface FormProps {
  initialValues: Record<string, any>;
  onSubmit: (values: Record<string, any>) => Promise<void> | void;
  children: React.ReactNode;
  className?: string;
  submitText?: string;
  loadingText?: string;
  successMessage?: string;
  errorMessage?: string;
}

const FormContent: React.FC<Omit<FormProps, "initialValues">> = ({
  onSubmit,
  children,
  className = "",
  submitText = "Submit",
  loadingText = "Submitting...",
  successMessage = "Form submitted successfully!",
  errorMessage = "An error occurred. Please try again.",
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { values } = useForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);

    try {
      await onSubmit(values);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={className} onSubmit={handleSubmit}>
      {children}

      {isSuccess && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      <div className="mt-3">
        <LoadingButton
          type="submit"
          loading={isSubmitting}
          loadingText={loadingText}
          variant="primary"
          fullWidth
        >
          {submitText}
        </LoadingButton>
      </div>
    </form>
  );
};

const Form: React.FC<FormProps> = (props) => {
  return (
    <FormProvider initialValues={props.initialValues}>
      <FormContent {...props} />
    </FormProvider>
  );
};

export default Form;
