import { Component } from "solid-js";
import { render } from "solid-js/web";
import { Router, pathIntegration } from "@rturnq/solid-router";

import { setup } from "./styled";
import Header from "./Header";
import Content from "./Content";
import MediaBar from "./MediaBar";
import { MediaProvider } from "./MediaContext";

setup();

const AppRoot: Component = () => (
  <Router integration={pathIntegration()}>
    <MediaProvider>
      <Header />
      <Content />
      <MediaBar />
    </MediaProvider>
  </Router>
);

render(() => <AppRoot />, document.getElementById("root") as HTMLDivElement);
