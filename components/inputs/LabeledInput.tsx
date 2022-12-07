import * as React from 'react';
import styled from 'styled-components';
import FormInput from './FormInput';
import Label from './Label';

const Container = styled.div`
  display: flex;
  justify-content: flex-start;

  flex-direction: column;
  margin: 1rem 0;
`;

interface LabeledInputProps {
  type?: string;
  label: string;
  inputId: string;
  placeholder?: string;
  required?: boolean;
  value?: any;
  onChange?: any;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
  type = 'text',
  label,
  inputId,
  ...rest
}) => {
  return (
    <Container>
      <Label htmlFor={inputId}>{label}</Label>
      <FormInput id={inputId} type={type} name={inputId} {...rest} />
    </Container>
  );
};

export default LabeledInput;
