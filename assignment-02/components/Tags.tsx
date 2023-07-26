import { styled } from "styled-components";

const Tag: React.FC<{ tags: string[] }> = ({ tags }) => {
  return (
    <StyledTags>
      {tags.map((tag) => (
        <StyledTag key={tag}>{tag}</StyledTag>
      ))}
    </StyledTags>
  );
};

const StyledTags = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  padding: 5px 20px;
`;

const StyledTag = styled.span`
  border: 1px solid gray;
  border-radius: 10px;
  padding: 5px 10px;
`;

export default Tag;
