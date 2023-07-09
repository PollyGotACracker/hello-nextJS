import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkPrism from "remark-prism";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export interface PostData {
  id?: string;
  categories: string[];
  date: string;
  description: string;
  slug: string;
  tags: string[];
  title: string;
  contentHtml: string;
}

const postsDirectory = path.join(process.cwd(), "__posts");

export const getPosts = (): PostData[] => {
  const fileNames = fs.readdirSync(postsDirectory);

  const postsData: PostData[] = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");

    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");

    // meta data 를 gray-matter 로 파싱
    const parsedPosts = matter(fileContents);

    return {
      id,
      ...(parsedPosts.data as PostData),
    };
  });

  return postsData.sort((a, b) => {
    return a.date < b.date ? 1 : -1;
  });
};

export const getPostIds = () => {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
};

export const getPost = async (id: string) => {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const parsedResult = matter(fileContents);
  // sanitize X
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkPrism)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(parsedResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...parsedResult.data,
  };
};
