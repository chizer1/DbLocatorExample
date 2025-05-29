import React from 'react';
import { useForm } from './FormContext';

interface CheckboxFieldProps {
  name: string;
  label: string;
  required?: boolean;
  validate?: (value: any) => string | undefined;
  helpText?: string;
  icon?: React.ReactNode;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  required = false,
  validate,
  helpText,
  icon,
}) => {
  const { values, errors, touched, setFieldValue, setFieldError, setFieldTouched } = useForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.checked;
    setFieldValue(name, value);
    
    if (validate) {
      const error = validate(value);
      setFieldError(name, error || '');
    }
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
  };

  const error = touched[name] && errors[name];
  const value = values[name] || false;

  return (
    <div className="mb-4">
      <div className="form-check">
        <input
          type="checkbox"
          id={name}
          name={name}
          checked={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          className={`form-check-input ${error ? 'is-invalid' : ''}`}
        />
        <label htmlFor={name} className="form-check-label d-flex align-items-center">
          {icon && <span className="me-2">{icon}</span>}
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </label>
      </div>
      
      {error && (
        <div className="invalid-feedback d-block mt-1">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div className="form-text mt-1">
          {helpText}
        </div>
      )}
    </div>
  );
};

export default CheckboxField; 