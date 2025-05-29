export const required = (value: any): string | undefined => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return 'This field is required';
  }
  return undefined;
};

export const email = (value: string): string | undefined => {
  if (!value) return undefined;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return 'Invalid email address';
  }
  return undefined;
};

export const minLength = (min: number) => (value: string): string | undefined => {
  if (!value) return undefined;
  if (value.length < min) {
    return `Must be at least ${min} characters`;
  }
  return undefined;
};

export const maxLength = (max: number) => (value: string): string | undefined => {
  if (!value) return undefined;
  if (value.length > max) {
    return `Must be at most ${max} characters`;
  }
  return undefined;
};

export const number = (value: string): string | undefined => {
  if (!value) return undefined;
  if (isNaN(Number(value))) {
    return 'Must be a number';
  }
  return undefined;
};

export const composeValidators = (...validators: Array<(value: any) => string | undefined>) => {
  return (value: any): string | undefined => {
    for (const validator of validators) {
      const error = validator(value);
      if (error) return error;
    }
    return undefined;
  };
}; 