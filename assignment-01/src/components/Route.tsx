import React from "react";
import PATH from "../constants/path";

type Props = {
  path: PATH;
  component: React.ReactNode;
};

const Route: React.FC<Props> = ({ path, component }) => {
  if (!path) throw new Error("No path specified");
  return component;
};

export default Route;
