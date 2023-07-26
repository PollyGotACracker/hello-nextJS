import { useEffect, useState } from "react";
import PATH from "../constants/path";

type PushParams = {
  state?: object;
  path: PATH;
};

const useRouter = () => {
  const [currentPath, setCurrentPath] = useState<PATH>(
    window.location.pathname as PATH
  );

  const changePath = () => setCurrentPath(window.location.pathname as PATH);

  useEffect(() => {
    window.addEventListener("popstate", changePath);
    return () => window.removeEventListener("popstate", changePath);
  }, []);

  return {
    currentPath,
    push: ({ state, path }: PushParams) => {
      const url = location.origin + path;
      const event = new PopStateEvent("popstate", { state: state });
      history.pushState(state, "", url);
      dispatchEvent(event);
    },
    back: () => {
      history.back();
    },
  };
};

export default useRouter;
