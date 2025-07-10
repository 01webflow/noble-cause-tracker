
import { useState } from 'react';

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface FormField {
  value: string;
  error: string;
  touched: boolean;
}

export interface FormFields {
  [key: string]: FormField;
}

export const useFormValidation = (initialFields: Record<string, string>) => {
  const [fields, setFields] = useState<FormFields>(() => {
    const formFields: FormFields = {};
    Object.keys(initialFields).forEach(key => {
      formFields[key] = {
        value: initialFields[key],
        error: '',
        touched: false
      };
    });
    return formFields;
  });

  const validateField = (name: string, value: string, rules: ValidationRules): string => {
    if (rules.required && !value.trim()) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    if (rules.minLength && value.length < rules.minLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be no more than ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      if (name === 'email') {
        return 'Please enter a valid email address';
      }
      return `${name.charAt(0).toUpperCase() + name.slice(1)} format is invalid`;
    }

    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return '';
  };

  const updateField = (name: string, value: string, rules?: ValidationRules) => {
    setFields(prev => ({
      ...prev,
      [name]: {
        value,
        error: rules ? validateField(name, value, rules) : '',
        touched: true
      }
    }));
  };

  const validateForm = (validationRules: Record<string, ValidationRules>): boolean => {
    let isValid = true;
    const newFields = { ...fields };

    Object.keys(validationRules).forEach(fieldName => {
      const field = fields[fieldName];
      const error = validateField(fieldName, field.value, validationRules[fieldName]);
      
      newFields[fieldName] = {
        ...field,
        error,
        touched: true
      };

      if (error) isValid = false;
    });

    setFields(newFields);
    return isValid;
  };

  const resetForm = () => {
    const resetFields: FormFields = {};
    Object.keys(fields).forEach(key => {
      resetFields[key] = {
        value: '',
        error: '',
        touched: false
      };
    });
    setFields(resetFields);
  };

  const getFieldValue = (name: string): string => fields[name]?.value || '';
  const getFieldError = (name: string): string => fields[name]?.error || '';
  const isFieldTouched = (name: string): boolean => fields[name]?.touched || false;
  const hasErrors = (): boolean => Object.values(fields).some(field => field.error);

  return {
    fields,
    updateField,
    validateForm,
    resetForm,
    getFieldValue,
    getFieldError,
    isFieldTouched,
    hasErrors
  };
};
