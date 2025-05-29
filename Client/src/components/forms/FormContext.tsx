import React, { createContext, useContext, useState, useCallback } from 'react';

interface FormContextType {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setFieldValue: (field: string, value: any) => void;
  setFieldError: (field: string, error: string) => void;
  setFieldTouched: (field: string, touched: boolean) => void;
  handleSubmit: (onSubmit: (values: Record<string, any>) => void) => (e: React.FormEvent) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  initialValues: Record<string, any>;
  children: React.ReactNode;
}

export const FormProvider: React.FC<FormProviderProps> = ({ initialValues, children }) => {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setFieldValue = useCallback((field: string, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const setFieldTouched = useCallback((field: string, touched: boolean) => {
    setTouched(prev => ({ ...prev, [field]: touched }));
  }, []);

  const handleSubmit = useCallback((onSubmit: (values: Record<string, any>) => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(values);
    };
  }, [values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const value = {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    handleSubmit,
    resetForm,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}; 