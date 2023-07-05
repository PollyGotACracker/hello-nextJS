import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Router from "./components/Router";
import Route from "./components/Route";
import Root from "./pages/Root";
import About from "./pages/About";
import PATH from "./constants/path";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Route path={PATH.ROOT} component={<Root />} />
      <Route path={PATH.ABOUT} component={<About />} />
    </Router>
  </React.StrictMode>
);
