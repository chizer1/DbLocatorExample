import React from "react";
import { useForm } from "./FormContext";

interface Option {
  value: string | number;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  validate?: (value: any) => string | undefined;
  helpText?: string;
  icon?: React.ReactNode;
  multiple?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  placeholder,
  required = false,
  validate,
  helpText,
  icon,
  multiple = false,
}) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  } = useForm();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = multiple
      ? Array.from(e.target.selectedOptions, (option) => option.value)
      : e.target.value;

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
  const value = values[name] || (multiple ? [] : "");

  return (
    <div className="mb-4">
      <label htmlFor={name} className="form-label d-flex align-items-center">
        {icon && <span className="me-2">{icon}</span>}
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>

      <div className="position-relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          multiple={multiple}
          className={`form-select ${error ? "is-invalid" : ""}`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && <div className="invalid-feedback d-block">{error}</div>}

        {helpText && !error && <div className="form-text">{helpText}</div>}
      </div>
    </div>
  );
};

export default SelectField;
