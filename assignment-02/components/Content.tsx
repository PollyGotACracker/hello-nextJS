import React from "react";
import { styled } from "styled-components";

const Content: React.FC<{ content: string }> = ({ content }) => {
  return <StyledContent dangerouslySetInnerHTML={{ __html: content }} />;
};

const StyledContent = styled.div`
  width: 100%;
  flex: 1;
  border-bottom: 1px solid #eaeaea;

  @media (prefers-color-scheme: dark) {
    border-color: #333;
  }
`;

export default Content;
