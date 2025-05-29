import React from 'react';
import Form from './Form';
import FormField from './FormField';
import SelectField from './SelectField';
import CheckboxField from './CheckboxField';
import RadioField from './RadioField';
import { composeValidators, required, email, minLength } from '../../utils/validation';
import { FaUser, FaEnvelope, FaLock, FaInfoCircle, FaGlobe, FaUserTag, FaCheck } from 'react-icons/fa';

interface ExampleFormData {
  name: string;
  email: string;
  password: string;
  description: string;
  country: string;
  role: string;
  preferences: string[];
  terms: boolean;
}

const ExampleForm: React.FC = () => {
  const initialValues: ExampleFormData = {
    name: '',
    email: '',
    password: '',
    description: '',
    country: '',
    role: '',
    preferences: [],
    terms: false,
  };

  const handleSubmit = async (values: ExampleFormData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Form submitted:', values);
  };

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
  ];

  const roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'user', label: 'Regular User' },
    { value: 'guest', label: 'Guest' },
  ];

  const preferences = [
    { value: 'newsletter', label: 'Newsletter' },
    { value: 'updates', label: 'Product Updates' },
    { value: 'marketing', label: 'Marketing Emails' },
  ];

  return (
    <div className="card shadow-sm">
      <div className="card-body p-4">
        <h2 className="card-title mb-4">Create Account</h2>
        
        <Form
          initialValues={initialValues}
          onSubmit={handleSubmit}
          className="needs-validation"
          submitText="Create Account"
          loadingText="Creating Account..."
          successMessage="Account created successfully!"
        >
          <FormField
            name="name"
            label="Full Name"
            required
            icon={<FaUser />}
            validate={composeValidators(required, minLength(2))}
            helpText="Enter your full name as it appears on your ID"
          />
          
          <FormField
            name="email"
            label="Email Address"
            type="email"
            required
            icon={<FaEnvelope />}
            validate={composeValidators(required, email)}
            helpText="We'll never share your email with anyone else"
          />
          
          <FormField
            name="password"
            label="Password"
            type="password"
            required
            icon={<FaLock />}
            validate={composeValidators(required, minLength(8))}
            helpText="Must be at least 8 characters long"
          />

          <SelectField
            name="country"
            label="Country"
            options={countries}
            required
            icon={<FaGlobe />}
            placeholder="Select your country"
            validate={required}
          />

          <RadioField
            name="role"
            label="Account Type"
            options={roles}
            required
            icon={<FaUserTag />}
            inline
            validate={required}
          />

          <SelectField
            name="preferences"
            label="Email Preferences"
            options={preferences}
            multiple
            icon={<FaEnvelope />}
            helpText="Select all that apply"
          />
          
          <FormField
            name="description"
            label="About You"
            type="textarea"
            icon={<FaInfoCircle />}
            validate={minLength(10)}
            helpText="Tell us a little bit about yourself"
          />

          <CheckboxField
            name="terms"
            label="I agree to the Terms and Conditions"
            required
        </Form>
      </div>
    </div>
  );
};

export default ExampleForm; 