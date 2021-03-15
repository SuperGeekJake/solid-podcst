import { Component, Switch } from "solid-js";
import { css } from "@emotion/css";
import { MatchRoute } from "@rturnq/solid-router";

import Hero from "./Hero";

const Content: Component = () => (
  <main class={cssRoot} data-component={Content.name}>
    <Switch fallback={<h1>404</h1>}>
      <MatchRoute end children={<HomePage />} />
    </Switch>
  </main>
);

export default Content;

const HomePage = () => <Hero />;

const cssRoot = css`
  /* padding-top: 64px; */
`;
