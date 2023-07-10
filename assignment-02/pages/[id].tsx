import { NextPage } from "next";
import { styled } from "styled-components";
import { PostData, getPostIds, getPost } from "../lib/posts";
import Categories from "../components/Categories";
import Title from "../components/Title";
import Tags from "../components/Tags";
import Content from "../components/Content";

export const Post: NextPage<{ postData: PostData }> = ({ postData }) => {
  return (
    <main>
      <Title
        title={postData.title}
        desc={postData.description}
        date={postData.date}
      />
      <StyledBody>
        <Categories categories={postData.categories} />
        <Content content={postData.contentHtml} />
        <Tags tags={postData.tags} />
      </StyledBody>
    </main>
  );
};

const StyledBody = styled.div`
  width: 100%;
  min-height: 75vh;
  padding: 4vh 5vw;
  display: flex;
  flex-direction: column;
  gap: 10px;

  & h1 {
    padding: 10px 0;
  }
  & ul,
  & ol {
    padding-left: 40px;
    margin: 10px 0;
  }
  & li {
    margin: 5px 0;
  }
`;

// getStaticPaths: 동적 라우팅 시, return 한 모든 경로를
// 정적으로 pre-rendering
// return 된 값은 getStaticProps 로 전달
export const getStaticPaths = () => {
  const paths = getPostIds();
  return {
    paths: paths.map((path) => {
      return {
        params: {
          id: path.params.id,
        },
      };
    }),
    fallback: false,
  };
};

type Params = {
  params: { id: string };
};
// getStaticProps: getStaticPaths 에서 return 한 값을 사용하여
// build 시 현재 페이지 미리 rendering
export const getStaticProps = async ({ params }: Params) => {
  const postData = await getPost(params.id);
  return {
    props: {
      postData,
    },
  };
};
export default Post;
