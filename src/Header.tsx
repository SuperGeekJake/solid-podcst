import { Component, createSignal } from "solid-js";

import { styled, css } from "./styled";
import { HamburgerSvg, MagnifySvg } from "./svg";

const Header: Component = () => {
  const [visible, setVisiblity] = createSignal<boolean>(false);
  return (
    <Root data-component={Header.name}>
      <Brand>
        <Logo href="/">Podcst</Logo>
      </Brand>
      <IconButton
        aria-expanded={visible().toString() as "true" | "false"}
        aria-controls="menu"
        aria-label="Menu"
        onClick={() => setVisiblity(!visible())}
      >
        <HamburgerSvg className={cssIcon} />
      </IconButton>
      <IconButton
        aria-expanded="false"
        aria-controls="search"
        aria-label="Search"
      >
        <MagnifySvg className={cssIcon} />
      </IconButton>
      <SignIn>Sign In</SignIn>
    </Root>
  );
};

export default Header;

const Root = styled("header")`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: var(--header-height);
  padding: 0 50px;
  background-color: rgba(15, 15, 15, 0); /* #0f0f0f */
  transition: background-color 0.3s ease-out;

  &:hover {
    background-color: rgba(15, 15, 15, 0.95);
  }
`;

const Brand = styled("div")`
  position: absolute;
  top: 0;
  right: auto;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled("a")`
  font-family: sans-serif;
  font-weight: bold;
  font-size: 30px;
  color: #fff;
  text-decoration: none;
  text-transform: uppercase;
`;

const IconButton = styled("button")`
  padding: 2px;
  margin: 0 25px 0 0;
  background: none;
  border: none;
  cursor: pointer;

  &:hover rect,
  &:hover path {
    fill: #fff;
  }
`;

const cssIcon = css`
  display: block;
  width: 20px;
  height: auto;

  rect,
  path {
    fill: #c8c8c8;
    transition: fill 0.15s ease-out;
  }
`;

const SignIn = styled("button")`
  padding: 0;
  margin: 0 0 0 auto;
  border: none;
  background: none;
  color: #c8c8c8;
  font-size: 15px;
  text-transform: uppercase;
  letter-spacing: 0.1px;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;
