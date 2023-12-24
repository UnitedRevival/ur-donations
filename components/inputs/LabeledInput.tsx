import * as React from 'react';
import styled from 'styled-components';
import FormInput from './FormInput';
import Label from './Label';

interface LabeledInputProps {
  type?: string;
  label: string;
  inputId: string;
  placeholder?: string;
  required?: boolean;
  value?: any;
  disabled?: boolean;
  onChange?: any;
  fullWidth?: boolean;
  spaced?: boolean;
  autocomplete?: string;
  halfWidth?: boolean;
}

const Container = styled.div<LabeledInputProps>`
  display: flex;
  justify-content: flex-start;
  flex-grow: 1;
  box-sizing: border-box;
  flex-direction: column;
  margin: 0.5rem 0;
  margin-right: ${({ spaced }) => (spaced ? '1rem' : '0')};
  ${({ fullWidth }) => (fullWidth ? 'width: 100%;' : '')}
  ${({ halfWidth }) => (halfWidth ? 'width: 40%;' : '')}
`;

const LabeledInput: React.FC<LabeledInputProps> = ({
  type = 'text',
  label,
  inputId,
  ...rest
}) => {
  return (
    // @ts-ignore
    <Container {...rest}>
      {/* <Label htmlFor={inputId}>{label}</Label> */}
      <FormInput id={inputId} type={type} name={inputId} {...rest} />
    </Container>
  );
};

export default LabeledInput;
