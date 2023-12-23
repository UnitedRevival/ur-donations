import styled from 'styled-components';
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e8e8e8;
  border-radius: ${(props) => props.theme.borderRadius};

  margin: 1rem 0;
`;
export default Divider;
