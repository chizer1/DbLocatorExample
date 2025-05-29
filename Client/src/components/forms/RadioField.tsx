import React from "react";
import { useForm } from "./FormContext";

interface Option {
  value: string | number;
  label: string;
}

interface RadioFieldProps {
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
  validate?: (value: any) => string | undefined;
  helpText?: string;
  icon?: React.ReactNode;
  inline?: boolean;
}

const RadioField: React.FC<RadioFieldProps> = ({
  name,
  label,
  options,
  required = false,
  validate,
  helpText,
  icon,
  inline = false,
}) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  } = useForm();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFieldValue(name, value);

    if (validate) {
      const error = validate(value);
      setFieldError(name, error || "");
    }
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
  };

  const error = touched[name] && errors[name];
  const value = values[name] || "";

  return (
    <div className="mb-4">
      <label className="form-label d-flex align-items-center">
        {icon && <span className="me-2">{icon}</span>}
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>

      <div className={`${inline ? "d-flex gap-3" : ""}`}>
        {options.map((option) => (
          <div key={option.value} className="form-check">
            <input
              type="radio"
              id={`${name}-${option.value}`}
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={handleChange}
              onBlur={handleBlur}
              required={required}
              className={`form-check-input ${error ? "is-invalid" : ""}`}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="form-check-label"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {error && <div className="invalid-feedback d-block mt-1">{error}</div>}

      {helpText && !error && <div className="form-text mt-1">{helpText}</div>}
    </div>
  );
};

export default RadioField;
