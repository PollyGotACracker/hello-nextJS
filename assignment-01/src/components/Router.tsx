import React, { ReactNode } from "react";
import useRouter from "../hooks/useRouter";

type Props = {
  children: Iterable<ReactNode>;
};

const Router: React.FC<Props> = ({ children }) => {
  const { currentPath } = useRouter();
  const childArray = Array.isArray(children) ? children : [children];

  return childArray.filter((route) => route.props.path === currentPath);
};

export default Router;
