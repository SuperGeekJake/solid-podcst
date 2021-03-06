import { Component } from "solid-js";
import { css } from '@emotion/css';

import Hero from './Hero';

const Content: Component = () => (
  <main class={cssRoot} data-component={Content.name}>
    <Hero />
  </main>
);

export default Content;

const cssRoot = css`
  /* padding-top: 64px; */
`;
