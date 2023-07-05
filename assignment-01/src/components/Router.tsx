import React, { ReactNode } from "react";

type Props = {
  children: Iterable<ReactNode>;
};

const Router: React.FC<Props> = ({ children }) => {
  return children;
};

export default Router;
