import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useStore } from 'react-redux';
import { Field as ReduxFormField } from 'redux-form';
import { map, toPairs, get } from 'lodash';
import * as Fields from '~/lib/ui/components/Fields';
import validations from '../utils/Validations';
import { FormComponent } from '../protocol-consts';

const ComponentTypeNotFound = (componentType) => {
  const ComponentTypeNotFoundInner = () => (
    <div>Input component &quot;{componentType}&quot; not found.</div>
  );

  return ComponentTypeNotFoundInner;
};

/*
  * Returns the named field component, if no matching one is found
  or else it just returns a text input
  * @param {object} field The properties handed down from the protocol form
  */
const getInputComponent = (componentType = 'Text') => {
  const def = get(FormComponent, componentType);
  return get(Fields, def, ComponentTypeNotFound(componentType));
};

/**
 * Returns the named validation function, if no matching one is found it returns a validation
 * which will always fail.
 * @param {string} validation The name of the validation function to return.
 */
const getValidation = (validation, store) =>
  map(toPairs(validation), ([type, options]) =>
    Object.hasOwnProperty.call(validations, type)
      ? validations[type](options, store)
      : () => `Validation "${type}" not found`,
  );

/**
 * Renders a redux-form field in the style of our app.
 * @param {string} label Presentational label
 * @param {string} name Property name
 * @param {string} component Field component
 * @param {string} placeholder Presentational placeholder text
 * @param {object} validation Validation methods
 */

const Field = ({ label = '', name, validation = {}, ...rest }) => {
  const store = useStore();
  const component = useMemo(
    () => getInputComponent(rest.component),
    [rest.component],
  );
  const validate = useMemo(
    () => rest.validate || getValidation(validation, store),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store],
  );

  return (
    <ReduxFormField
      {...rest}
      name={name}
      label={label}
      component={component}
      validate={validate}
    />
  );
};

Field.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  validation: PropTypes.object,
  validate: PropTypes.array,
};

export default Field;
