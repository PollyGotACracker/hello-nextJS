import { styled } from "styled-components";
import useRouter from "../hooks/useRouter";
import PATH from "../constants/path";

type Props = {
  text: string;
  path?: PATH;
};

const Button: React.FC<Props> = ({ text, path }) => {
  const { push, back } = useRouter();
  const changeUrl = () => {
    path ? push({ path: path }) : back();
  };

  return <StyledButton onClick={changeUrl}>{text}</StyledButton>;
};

const StyledButton = styled.button`
  color: inherit;
  text-decoration: none;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;

  &:hover {
    border-color: #646cff;
  }
  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }
`;

export default Button;
