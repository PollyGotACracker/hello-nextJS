import { styled } from "styled-components";

type Props = {
  text: string;
};

const Header: React.FC<Props> = ({ text }) => {
  return <StyledHeader>{text}</StyledHeader>;
};

const StyledHeader = styled.h1`
  font-size: 3.2em;
  line-height: 1.1;
`;

export default Header;
