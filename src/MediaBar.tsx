import {
  Component,
  createEffect,
  createMemo,
  JSX,
  Match,
  Show,
  Switch,
} from "solid-js";

import { styled, css, keyframes } from "./styled";
import { useMediaContext } from "./MediaContext";
import {
  PlaySvg,
  PauseSvg,
  CycleSvg,
  PreviousSvg,
  NextSvg,
  VolumeSvg,
} from "./svg";
import { FormattedDuration } from "./formatting";
import SeekBar from "./Seekbar";

const MediaBar: Component = () => {
  let playRef: HTMLButtonElement;
  const [state, actions] = useMediaContext();
  const track = createMemo<App.Episode | undefined>(
    () => state.playlist[state.track]
  );
  const hasLoadedTrack = createMemo(
    () => state.status === "playing" || state.status === "paused"
  );
  const hasPreviousTrack = createMemo(() => !!state.playlist[state.track - 1]);
  const hasNextTrack = createMemo(() => !!state.playlist[state.track + 1]);
  const volumeScaled = createMemo(() => state.volume * VOLUME_SCALE);
  const artSrc = createMemo(
    () => track()?.episodeArt || track()?.cover || undefined
  );
  const handleVolumeChange: JSX.EventHandler<HTMLInputElement, Event> = (
    evt
  ) => {
    const value = parseInt(evt.currentTarget.value) / VOLUME_SCALE;
    actions.volume(value);
  };
  createEffect(() => {
    if (state.status === "loading") playRef.focus();
  });
  return (
    <Root data-component={MediaBar.name} data-visible={state.status !== "idle"}>
      <TrackDetails>
        <div>
          <Show when={!!artSrc()}>
            <TrackArt src={artSrc()} alt="Episode Art" />
          </Show>
        </div>
        <div>
          <TrackTitle>{track()?.title}</TrackTitle>
          {/* TODO: Update endpoint to return podcast title in episode data */}
          <TrackAuthor>{track()?.author}</TrackAuthor>
        </div>
      </TrackDetails>

      <TrackControls>
        <IconButton
          aria-label="Previous song"
          title="Previous song"
          disabled={!hasPreviousTrack()}
        >
          <PreviousSvg className={cssDeemphasizedIcon} />
        </IconButton>
        <Toggle
          ref={(ref: any) => (playRef = ref)}
          onClick={actions.toggle}
          disabled={!hasLoadedTrack()}
          aria-label="Play"
          title="Play"
        >
          <Switch fallback={<LoadingIcon className={cssIcon} />}>
            <Match when={state.status === "paused"}>
              <PlaySvg className={cssIcon} />
            </Match>
            <Match when={state.status === "playing"}>
              <PauseSvg className={cssIcon} />
            </Match>
          </Switch>
        </Toggle>
        <IconButton
          disabled={!hasNextTrack()}
          aria-label="Next song"
          title="Next song"
        >
          <NextSvg className={cssDeemphasizedIcon} />
        </IconButton>
      </TrackControls>

      <MediaControls>
        <label aria-label="Volume" title="Volume">
          <VolumeSvg className={cssIcon} />
          <VolumeSlider
            type="range"
            id="volume"
            name="volume"
            min="0"
            max={VOLUME_SCALE}
            value={volumeScaled()}
            onChange={handleVolumeChange}
          />
        </label>
        <button>Closed Captions</button>
      </MediaControls>

      <SeekInfo>
        <FormattedDuration value={state.seek} /> /{" "}
        <FormattedDuration value={state.duration || undefined} />
      </SeekInfo>

      <Show when={hasLoadedTrack()}>
        <SeekBar
          seek={state.seek as number}
          duration={state.duration as number}
          onChange={actions.seek}
        />
      </Show>
    </Root>
  );
};

export default MediaBar;

const VOLUME_SCALE = 50;

const Root = styled("div")`
  --media-bar-height: 90px;

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;

  /* Hide UI until playing */
  visibility: hidden;
  transform: translateY(var(--media-bar-height));

  display: flex;
  align-items: center;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  height: var(--media-bar-height);
  background-color: rgba(15, 15, 15, 0.95);
  transition: all 0.3s ease-out;

  &[data-visible] {
    visibility: visible;
    transform: translateY(0);
  }
`;

const TrackDetails = styled("div")`
  flex: 1;
  display: flex;
  align-items: center;
`;

const TrackArt = styled("img")`
  display: block;
  width: var(--media-bar-height);
  height: var(--media-bar-height);
  object-fit: fill;
  margin-right: 10px;
`;

const TrackTitle = styled("div")`
  margin-bottom: 2px;
  font-family: sans-serif;
  font-size: 20px;
`;

const TrackAuthor = styled("div")`
  font-size: 15px;
`;

const TrackControls = styled("div")`
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const MediaControls = styled("div")`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const IconButton = styled("button")`
  padding: 2px;
  margin: 0;
  background: none;
  border: none;
  cursor: pointer;

  &:not(:disabled):hover {
    svg {
      fill: #fff;
    }
  }

  &:disabled {
    cursor: default;

    svg {
      fill: #818181;
    }
  }
`;

const cssIcon = css`
  display: block;
  fill: #c8c8c8;
  transition: fill 0.15s ease-out;
`;

const cssDeemphasizedIcon = css`
  /* TODO: Class composition not a feature of goober */
  /* ${cssIcon}; */
  width: auto;
  height: 20px;
`;

const Toggle = styled(IconButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  margin: 0 15px;
`;

const spin = keyframes`
  100% {
    transform: rotate(360deg);
  }
`;

const LoadingIcon = styled(CycleSvg)`
  animation: ${spin} 1.5s linear infinite;
  width: auto;
  height: 32px;
`;

const SeekInfo = styled("div")`
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 8px;
  margin-right: 8px;
  font-size: 13px;
  font-family: monospace;
`;

const VolumeSlider = styled("input")`
  opacity: 0;
  width: 0;
  position: absolute;
  top: 0;
  left: 50%;

  &:focus {
    opacity: 1;
    width: auto;
  }
`;
