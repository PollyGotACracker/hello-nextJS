import styled from "styled-components";

const Categories: React.FC<{ categories: string[] }> = ({ categories }) => {
  return (
    <StyledCategoryBox>
      {categories.map((category) => (
        <StyledCategory key={category}>{category}</StyledCategory>
      ))}
    </StyledCategoryBox>
  );
};

const StyledCategoryBox = styled.div`
  width: 100%;
  display: flex;
`;

const StyledCategory = styled.span`
  &:not(:last-child)::after {
    content: "/";
    margin: 0 10px;
  }
`;

export default Categories;
