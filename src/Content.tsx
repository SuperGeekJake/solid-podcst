import { Component, Switch } from "solid-js";
import { MatchRoute } from "@rturnq/solid-router";

import { styled } from "./styled";
import Hero from "./Hero";

const Content: Component = () => (
  <Root data-component={Content.name}>
    <Switch fallback={<h1>404</h1>}>
      <MatchRoute end children={<HomePage />} />
    </Switch>
  </Root>
);

export default Content;

const HomePage = () => <Hero />;

const Root = styled("main")`
  /* padding-top: 64px; */
`;
