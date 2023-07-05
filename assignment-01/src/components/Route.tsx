import React from "react";
import PATH from "../constants/path";
import useRouter from "../hooks/useRouter";

type Props = {
  path: PATH;
  component: React.ReactNode;
};

const Route: React.FC<Props> = ({ path, component }) => {
  const { currentPath } = useRouter();
  return currentPath === path ? component : <></>;
};

export default Route;
