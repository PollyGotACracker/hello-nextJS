import Link from "next/link";
import { PostData } from "../lib/posts";
import { styled } from "styled-components";

const List: React.FC<{ posts: PostData[] }> = ({ posts }) => {
  return (
    <StyledUl>
      {posts.map(({ id, title, date }, index) => (
        <Link key={id} href={`/${id}`}>
          <StyledLi>
            <span className="post-index">{posts.length - index}</span>
            <span className="post-title">{title}</span>
            <span className="post-date">{date}</span>
          </StyledLi>
        </Link>
      ))}
    </StyledUl>
  );
};

const StyledUl = styled.ul`
  padding-inline-start: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledLi = styled.li`
  display: flex;
  gap: 10px;
  width: 100%;
  list-style: none;
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  transition: color 0.2s ease;

  & .post-title {
    flex: 1;
  }

  &:hover {
    color: #0070f3;
  }

  @media (prefers-color-scheme: dark) {
    border-color: #333;
  }
`;

export default List;
