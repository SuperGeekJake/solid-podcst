import { Component } from "solid-js";

export const HamburgerSvg: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    width="36"
    height="28"
    viewBox="0 0 36 28"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="36" height="4" />
    <rect y="12" width="36" height="4" />
    <rect y="24" width="36" height="4" />
  </svg>
);

export const MagnifySvg: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    width="36"
    height="36"
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M36,33.17l-7.38-7.38A15.86,15.86,0,0,0,32,16,16,16,0,1,0,16,32a15.86,15.86,0,0,0,9.79-3.38L33.17,36ZM4,16A12,12,0,1,1,16,28,12,12,0,0,1,4,16Z" />
  </svg>
);

export const PlaySvg: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    width="23.3"
    height="32.2"
    viewBox="0 0 23.3 32.2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M23,15.4l-.11-.08L1.73.32,1.38.08A1,1,0,0,0,1,0,1,1,0,0,0,0,1V31.2a1,1,0,0,0,1,1,1,1,0,0,0,.38-.08l.35-.24,21.17-15L23,16.8a1,1,0,0,0,0-1.4Z" />
  </svg>
);

export const PauseSvg: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    width="24"
    height="32"
    viewBox="0 0 24 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="8" height="32" rx="1" />
    <rect x="16" width="8" height="32" rx="1" />
  </svg>
);

export const CycleSvg: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    width="36"
    height="36"
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8.11,8.11a14,14,0,0,1,20.74,1L24,14H36V2L31.69,6.31A18,18,0,0,0,.46,14H4.57A13.77,13.77,0,0,1,8.11,8.11Z" />
    <path d="M27.89,27.89a14,14,0,0,1-20.74-1L12,22H0V34l4.31-4.31A18,18,0,0,0,35.54,22H31.41A13.89,13.89,0,0,1,27.89,27.89Z" />
  </svg>
);

export const PreviousSvg: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    width="28"
    height="32.2"
    viewBox="0 0 28 32.2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M1,.1H7a1,1,0,0,1,1,1V13.27L26.27.32l.35-.24A1,1,0,0,1,28,1V31.2a1,1,0,0,1-1.38.92l-.35-.24L8,18.93V31.1a1,1,0,0,1-1,1H1a1,1,0,0,1-1-1V1.1A1,1,0,0,1,1,.1Z" />
  </svg>
);

export const NextSvg: Component<{ class?: string }> = (props) => (
  <svg
    class={props.class}
    width="28"
    height="32.2"
    viewBox="0 0 28 32.2"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M27,.1H21a1,1,0,0,0-1,1V13.27L1.73.32,1.38.08A1,1,0,0,0,1,0,1,1,0,0,0,0,1V31.2a1,1,0,0,0,1,1,1,1,0,0,0,.38-.08l.35-.24L20,18.93V31.1a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V1.1A1,1,0,0,0,27,.1Z" />
  </svg>
);
