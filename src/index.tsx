import { Component } from "solid-js";
import { render } from "solid-js/web";

import Header from "./Header";
import Content from './Content';
import MediaBar from './MediaBar';
import { MediaProvider } from './MediaContext';

const AppRoot: Component = () => (
  <MediaProvider>
    <Header />
    <Content />
    <MediaBar />
  </MediaProvider>
);

render(
  () => <AppRoot />,
  document.getElementById("root") as HTMLDivElement
);
