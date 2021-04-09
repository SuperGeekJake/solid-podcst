import { Component, createMemo } from "solid-js";
import { styled } from "./styled";

const SeekBar: Component<{
  seek: number;
  duration: number;
  onChange: (val: number) => void;
}> = (props) => {
  let root: HTMLDivElement | undefined;
  const percentage = createMemo(() => props.seek / props.duration);
  const position = createMemo(
    () => percentage() * (root?.getBoundingClientRect().width || 0)
  );
  const handleClick = (e: MouseEvent) => {
    if (!root) return;
    const bar = root.getBoundingClientRect();
    const position = e.clientX - bar.x;
    const percentage = position / bar.width;
    const numOfSeconds = percentage * props.duration;
    props.onChange(numOfSeconds);
  };
  return (
    <Root ref={(ref: any) => (root = ref)} onClick={handleClick} data-focusable>
      <SeekProgress percentage={percentage()} />
      <SeekHandle position={position()} />
    </Root>
  );
};

export default SeekBar;

const Root = styled("div")`
  position: absolute;
  top: -14px;
  left: 90px;
  right: 0;
  height: 32px;
  cursor: pointer;
`;

const SeekProgress = styled("div")<{ percentage: number }>`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 3px;
  margin-top: -2px;
  background: red;
  transform: scaleX(${(p) => p.percentage});
  transform-origin: center left;
`;

const SeekHandle = styled("div")<{ position: number }>`
  visibility: hidden;
  position: absolute;
  top: 9px;
  left: -6px;
  width: 13px;
  height: 13px;
  transform: translateX(${(p) => p.position}px);
  background: red;
  border-radius: 50%;

  [data-focusable]:hover > &,
  [data-focusable]:focus > & {
    visibility: visible;
  }
`;
