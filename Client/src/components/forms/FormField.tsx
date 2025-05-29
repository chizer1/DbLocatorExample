import React, { useState } from "react";
import { useForm } from "./FormContext";

interface Option {
  value: string;
  label: string;
}

interface FormFieldProps {
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "number" | "textarea" | "select";
  placeholder?: string;
  required?: boolean;
  validate?: (value: any) => string | undefined;
  helpText?: string;
  icon?: React.ReactNode;
  options?: Option[];
  multiple?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  required = false,
  validate,
  helpText,
  icon,
  options,
  multiple,
}) => {
  const {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
  } = useForm();
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    let value;
    if (type === "select" && multiple) {
      const select = e.target as HTMLSelectElement;
      value = Array.from(select.selectedOptions, (option) => option.value);
    } else {
      value = e.target.value;
    }
    setFieldValue(name, value);

    if (validate) {
      const error = validate(value);
      setFieldError(name, error || "");
    }
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
    setIsFocused(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const error = touched[name] && errors[name];
  const value = values[name] || (multiple ? [] : "");

  const inputProps = {
    id: name,
    name,
    value,
    onChange: handleChange,
    onBlur: handleBlur,
    onFocus: handleFocus,
    placeholder,
    required,
    className: `form-control ${error ? "is-invalid" : ""} ${isFocused ? "focus-ring" : ""}`,
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="form-label d-flex align-items-center">
        {icon && <span className="me-2">{icon}</span>}
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>

      <div className="position-relative">
        {type === "textarea" ? (
          <textarea {...inputProps} rows={4} />
        ) : type === "select" ? (
          <select {...inputProps} multiple={multiple}>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input {...inputProps} type={type} />
        )}

        {error && <div className="invalid-feedback d-block">{error}</div>}

        {helpText && !error && <div className="form-text">{helpText}</div>}
      </div>
    </div>
  );
};

export default FormField;
