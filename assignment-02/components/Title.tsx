import { styled } from "styled-components";
import { AiFillCalendar } from "react-icons/ai";

const Title: React.FC<{ title: string; desc: string; date: string }> = ({
  title,
  desc,
  date,
}) => {
  return (
    <StyledTitle>
      <div className="post-title">{title}</div>
      <div className="post-desc">{desc}</div>
      <div className="post-date">
        <AiFillCalendar /> {date}
      </div>
    </StyledTitle>
  );
};

const StyledTitle = styled.header`
  background-color: rgba(0, 0, 0, 0.2);
  width: 100%;
  min-height: 25vh;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 50px 10px;

  & > * {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  & > .post-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
  }
  & > .post-date {
    font-size: 0.8rem;
    margin-top: 2rem;
  }

  @media (prefers-color-scheme: dark) {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export default Title;
