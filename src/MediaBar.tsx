import { Component, createEffect, createMemo, JSX, Match, Show, Switch } from "solid-js";
import { css } from '@emotion/css';

import { useMediaContext } from './MediaContext';
import { PlaySvg, PauseSvg, CycleSvg, PreviousSvg, NextSvg } from './svg';
import { FormattedDuration } from './formatting';

const MediaBar: Component = () => {
  let playRef: HTMLButtonElement;
  const [state, actions] = useMediaContext();
  const track = createMemo<App.Episode | undefined>(() => state.playlist[state.track]);
  const hasLoadedTrack = createMemo(() => state.status === 'playing' || state.status === 'paused');
  const hasPreviousTrack = createMemo(() => !!state.playlist[state.track - 1]);
  const hasNextTrack = createMemo(() => !!state.playlist[state.track + 1]);
  const volumeScaled = createMemo(() => state.volume * VOLUME_SCALE);
  const artSrc = createMemo(() => track()?.episodeArt || track()?.cover || undefined);
  const handleVolumeChange: JSX.EventHandler<HTMLInputElement, Event> = (evt) => {
    const value = parseInt(evt.target.value) / VOLUME_SCALE;
    actions.volume(value);
  };
  createEffect(() => {
    if (state.status === 'loading') {
      playRef.focus();
    }
  });
  return (
    <div class={cssRoot} data-component={MediaBar.name} data-visible={state.status !== 'idle'}>
      <div class={cssTrackDetails}>
        <div>
          <Show when={!!artSrc()}>
            <img
              class={cssTrackArt}
              src={artSrc()}
              alt="Episode Art"
            />
          </Show>
        </div>
        <div>
          <div class={cssTrackTitle}>{track()?.title}</div>
          {/* TODO: Update endpoint to return podcast title in episode data */}
          <div class={cssTrackAuthor}>{track()?.author}</div>
        </div>
      </div>

      <div class={cssTrackControls}>
        <button
          class={cssIconButton}
          aria-label="Previous song"
          title="Previous song"
          disabled={!hasPreviousTrack()}
        >
          <PreviousSvg class={cssDeemphasizedIcon} />
        </button>
        <button
          ref={ref => playRef = ref}
          class={cssToggle}
          onClick={actions.toggle}
          disabled={!hasLoadedTrack()}
          aria-label="Play"
          title="Play"
        >
          <Switch fallback={<CycleSvg class={cssLoadingIcon} />}>
            <Match when={state.status === 'paused'}>
              <PlaySvg class={cssIcon} />
            </Match>
            <Match when={state.status === 'playing'}>
              <PauseSvg class={cssIcon} />
            </Match>
          </Switch>
        </button>
        <button
          class={cssIconButton}
          disabled={!hasNextTrack()}
          aria-label="Next song"
          title="Next song"
        >
          <NextSvg class={cssDeemphasizedIcon} />
        </button>
      </div>

      <div class={cssMediaControls}>
        <label>
          Volume
          <input
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
      </div>

      <div class={cssSeekInfo}>
        <FormattedDuration value={state.seek} /> / <FormattedDuration value={track()?.duration || undefined} />
      </div>
    </div>
  );
};

export default MediaBar;

const VOLUME_SCALE = 50;

const cssRoot = css`
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

const cssTrackDetails = css`
  flex: 1;
  display: flex;
  align-items: center;
`;

const cssTrackArt = css`
  width: var(--media-bar-height);
  height: var(--media-bar-height);
  object-fit: fill;
  margin-right: 10px;
`;

const cssTrackTitle = css`
  margin-bottom: 2px;
  font-family: sans-serif;
  font-size: 20px;
`;

const cssTrackAuthor = css`
  font-size: 15px;
`;

const cssTrackControls = css`
  flex: 0 0 auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const cssMediaControls = css`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const cssIconButton = css`
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

const cssToggle = css`
  ${cssIconButton}
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
  margin: 0 15px;
`;

const cssLoadingIcon = css`
  ${cssIcon}
  @keyframes spin { 100% { transform:rotate(360deg); } }
  animation:spin 1.5s linear infinite;
  width: auto;
  height: 32px;
`;

const cssDeemphasizedIcon = css`
  ${cssIcon}
  width: auto;
  height: 20px;
`;

const cssSeekInfo = css`
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 5px;
  font-size: 13px;
  font-family: monospace;
`;
